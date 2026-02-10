const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    products:[{
        product:{type:Object,required:true},
        quantity:{type:Number,required:true}
    }],
    user:{
        name:{type:String,required:true},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
    }
})

module.exports =  mongoose.model('Order',OrderSchema);