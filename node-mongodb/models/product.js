const mongoConnect = require('../util/database')
const getDb = require('../util/database').getDb;
const { ObjectId } = require('mongodb');


class Product  {
  constructor(title, price, description, imageUrl,id,userId){
    this.title=title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
    this.userId = userId;
  }

  save(){
    const db = getDb();
    let dbOp;
    // console.log(this._id);
    if(this._id){
      dbOp = db.collection('products').updateOne({_id:new ObjectId(this._id)},{$set:{title:this.title, price:this.price, description:this.description, imageUrl:this.imageUrl}})
    }else{
      dbOp = db.collection('products').insertOne(this);
    }
     return dbOp.then(result=>{
      console.log(result);
     }).catch(err=>console.log(err));
  }

  static fetchAll(){
    const db = getDb();
    return db.collection('products').find().toArray().then(products=>{
      return products;
    }).catch(err=>{
      console.log(err)
    })
  }

  static findOne(productId){
    const db = getDb();
    return db.collection('products').findOne({ _id: new ObjectId(productId) }).then(product=>{
      return product;
    }).catch(err=>{
      console.log(err)
    })
  }

  static deleteById(productId){
    const db = getDb();
    return db.collection('products').deleteOne({_id:new ObjectId(productId)}).then(result=>{
      console.log('Deleted');
    }).catch(err=>console.log(err))
  }

  
}

module.exports = Product;