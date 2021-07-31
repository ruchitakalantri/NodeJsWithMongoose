const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// description of how product should look like
const productSchema = new Schema({
  // Key : Value Pair
  title : {
    type : String ,
    required : true
  } ,
  price : {
    type : Number ,
    required : true
  } ,
  description : {
    type : String ,
    required : true
  } ,
  imageUrl : {
    type : String ,
    required : true
  } ,
  userId : {
    type : Schema.Types.ObjectId,
    ref : 'User',
    required : true
  }
});

// models

module.exports = mongoose.model('Product' , productSchema);
