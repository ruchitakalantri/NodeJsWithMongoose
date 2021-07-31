const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// description of how order should look like
const orderSchema = new Schema({
  // Key : Value Pair
  products : 
    [
      {
        product :
          {
              type : Object,  
            required : true
          } , 
        quantity : 
          {
              type : Number , 
          required : true
          }
      }
    ],
    user : {
        name : {
            type : String , 
            required : true
        } ,
        userId : {
            type : Schema.Types.ObjectId ,
            required : true ,
            ref : 'User'
        }
    }
});

// models

module.exports = mongoose.model('Order' , orderSchema);
