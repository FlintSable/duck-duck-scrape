var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var DuckSchema = new Schema({
	title: {
		type: String, 
		unique: true,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	note: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}
});

DuckSchema.plugin(uniqueValidator);

var Duck = mongoose.model('Duck', DuckSchema);

module.exports = Duck;