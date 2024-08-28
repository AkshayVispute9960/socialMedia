import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
  
   firstName: {
     type: String,
     required: true,
     lowercase: true,
     trim:true
   },

   lastName: {
    type:String,
    required:true,
    lowercase:true,
    trim:true
   },

   email: {
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique: true
   },

   password: {
     type:String,
     required:[true, "password is required"]
   },

   role: {
     type: String,
     enum: ["User","Admin"],
     required: true
   },

status:{
  type:Boolean,
  default:true,
  required:true
},

refreshToken: {
    type: String
}
},
{
    timestamps:true
})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCurrect = async function( password ){
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = async function (){
    return jwt.sign({
       _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User = mongoose.model("User",userSchema)

