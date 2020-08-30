// This model is going to store all our shorturl information

const mongoose = require('mongoose');
const shortid = require('shortid');
// shortid : Amazingly short non-sequential url-friendly unique id generator.

const shorturlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

// eslint-disable-next-line prettier/prettier
module.exports = mongoose.model('shorturl', shorturlSchema);
