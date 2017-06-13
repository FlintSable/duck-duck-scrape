var express = require('express');
var router = express.Router();
var request = require('request');

const Article = require('../models/Article');
const Note = require('../models/Note');

const mongoose = require('mongoose');
const cheerio = require('cheerio');

router.get('/', function(req, res) {
    res.redirect('/home');
});

router.get('/home', function(req, res) {
    let url = 'https://www.animenewsnetwork.com/';
    request(url, function(error, response, html) {
        var $ = cheerio.load(html);
        $('div.wrap').each(function(i, element) {
            var result = {};
            result.title = $(this).find('> div > h3 > a > cite').text();
            result.link = url + $(this).find('> div > h3 > a').attr('href');
            var entry = new Article(result);
            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });
        });
    });
    res.render('home');
});

router.get('/articles', function(req, res){
    Article.find({}, function(err, doc){
        if(err){
            console.log(err);
        }else{
            res.json(doc);
        }
    });
});

router.get('/articles/:id', function(req, res){
    Article.findOne({'_id': req.params.id })
    .populate('note')
    .exec(function(err, doc){
        if(err){
            console.log(err);
        }else{
            res.json(doc);
        }
    });
});

router.post('/deletenote/:id', function(req, res){
    Note.findOne({'_id': req.params.id })
    .remove('note')
    .exec(function(err, doc){
        if(err){
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

router.post('/articles/:id', function(req, res){
    var newNote = new Note(req.body);

    newNote.save(function(err, doc) {
        if(err){
            console.log(err);
        } else {
            Article.findOneAndUpdate({ '_id': req.params.id }, {'note':doc._id})
            .exec(function(err, doc){
                if(err){
                    console.log(err);
                } else{
                    res.send(doc);
                }
            });
        }
    });
});


module.exports = router;