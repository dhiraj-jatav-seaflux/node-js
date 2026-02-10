const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ email: this.email })
      .then((user) => {
        if (user) {
          return "User already exists";
        }
        return db.collection("users").insertOne(this);
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const db = getDb();
    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => i.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          const cartItem = this.cart.items.find((i) => {
            return i.productId.toString() === p._id.toString();
          });

          return {
            ...p,
            cartItem: cartItem,
          };
        });
      });
  }

  deleteItemFromCart(productId){
    const db = getDb();

    const updatedCartItems = this.cart.items.filter(item=>item.productId.toString() !== productId.toString());

    return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set:{cart:{items:updatedCartItems}}})
  }

  addOrder(){
    const db = getDb();
    return this.getCart().then(products=>{
        const order = {
            items:products,
            user:{
                _id:new ObjectId(this._id),
                name:this.username
            }
        }
        return db.collection('order').insertOne(order)
    })
     .then(result=>{
        this.cart = {items:[]};
        return db.collection('users').updateOne({_id:new ObjectId(this._id)},{$set:{cart:{items:[]}}});
    })
  }

  getOrders(){
    const db = getDb();

    return db.collection('order').find({'user._id': new ObjectId(this._id)}).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        if (!user) return null;

        const loadedUser = new User(user.username, user.email);
        loadedUser._id = user._id;
        loadedUser.cart = user.cart;

        return loadedUser;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
