import mongoose from "mongoose";
import bcrypt from 'bcrypt'
// estaplish the schema calling useSchema

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
   profilePicture: {
    type: String,
    default: null,
  },
    role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true })

// hass the user password before saved into database
 userSchema.pre('save', async function(next){
  // if password not changed
  if(!this.isModified('password')) return next()
    // haddi kle abuuro 10 character kla duwan password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt);
 })

//  compare the passwords,  user password vs password in database.

// userSchema.methods.comparePassword = function(inputPassword){
//   return bcrypt.compare(inputPassword,this.password)
// }

const userDb = mongoose.model('Users', userSchema)

export default userDb;