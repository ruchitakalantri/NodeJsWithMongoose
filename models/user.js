const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({

  name : {
    type : String,
    required : true
  } ,
  email : {
    type : String,
    required : true
  }, 
  cart : {
    items : 
    [
      {
        productId :
          {type : Schema.Types.ObjectId , 
            ref : 'Product' , 
            required : true
          } , 
        quantity : 
          {type : Number , 
          required : true
          }
      }
    ]
  }

});

userSchema.methods.addToCart = function (product) {
  // item already in cart
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    // copy old element first : updatedCartItems
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0 ) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1 ;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      //item does not exist before
      updatedCartItems.push({ 
        productId : product._id , 
        quantity : newQuantity
      });
    }
    // items to store into database
    const updatedCart = {
      items : updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();

}

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString() ;
  });

  this.cart.items = updatedCartItems;
  return this.save();

}

userSchema.methods.clearCart = function () {
  this.cart = {items : [] };
  return this.save();
}

module.exports = mongoose.model('User' , userSchema);

