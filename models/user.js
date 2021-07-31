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


// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectID;

// class User {
//   constructor(username , email , cart , id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items : []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection('users')
//       .insertOne(this);

//   }

//   addToCart(product) {
//     // item already in cart
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     // copy old element first : updatedCartItems
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0 ) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1 ;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       //item does not exist before
//       updatedCartItems.push({ productId : new ObjectId(product._id) , quantity : newQuantity})
//     }

//     // items to store into database
//     const updatedCart = {
//       items : updatedCartItems
//     };
//     const db = getDb();
//     return db.collection('users')
//       .updateOne(
//         { _id : new ObjectId(this._id)} , 
//         { $set : {cart : updatedCart}}
//       );
//     }

//     getCart() {
//       // already has cart
//       const db = getDb();
//       const productIds = this.cart.items.map(i => {
//         return i.productId;
//       });
//       // array of products : from database
//       // map : execute function on every ellement of array
//       return db
//         .collection('products')
//         .find({ _id: { $in: productIds } })
//         .toArray()
//         .then(products => {
//           return products.map(p => {
//             return {
//               ...p,
//               quantity: this.cart.items.find(i => {
//                 // look at all element in  cart item
//                 return i.productId.toString() === p._id.toString();
//               }).quantity
//             };
//           });
//         });
//     }

    // deleteItemFromCart(productId) {
    //   const updatedCartItems = this.cart.items.filter(item => {
    //     return item.productId.toString() !== productId.toString() ;
    //   });

    //   // update database
    //   const db = getDb();
    //   return db.collection('users')
    //     .updateOne(
    //       { _id : new ObjectId(this._id)} , 
    //       { $set : {cart : {items : updatedCartItems}}}
    //     );
    //   }

//     addOrder() {
//       const db = getDb();
//       return this.getCart().then(products => {
//         const order = {
//           items : products ,
//           user : {
//             _id : new ObjectId(this._id),
//             name : this.name 
//           }
//         };
//       return db.collection('orders').insertOne(order)
//       })
//         .then(result => {
//           this.cart = {items : []};
//           return db
//             .collection('users')
//             .updateOne(
//               { _id : new ObjectId(this._id)} , 
//               { $set : {cart : {items : []}}}
//             );
//         });
//       }
   
//      getOrders() {
//       const db = getDb();
//       return db
//         .collection('orders')
//         .find({'user._id' : new ObjectId(this._id)})
//         .toArray();
//      } 

//   // .. find will give curser
//   //.find({_id : new ObjectId(userId)}).next();
//   // use findOne : will give 1 element

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({_id : new ObjectId(userId)})
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
