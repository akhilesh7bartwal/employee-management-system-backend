const mongoose = require('mongoose')

const adminSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            min:4,
            max:25
        },
        email:{
            type:String,
            required:true,
            min:5,
            max:255,
        },
        address:{
            type:String,
            required:true,
            min:6,
            max:255
        },
        password:{
            type:String,
            required:true,
            min:6,
            max:255
        },
    }
)
module.exports = mongoose.model('admin_detail',adminSchema)