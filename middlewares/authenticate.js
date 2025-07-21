import jwt from 'jsonwebtoken';
import userDb from '../models/userDb.js';
export const protect = async (req,res,next) =>{
   const token = req.headers.authorization?.split(" ")[1];
   console.log(token);
if (!token) {
  return res.status(401).json({ message: 'Not authorized, token missing' });
}
       //  decode to see if token is valid or not
       try {
           const decode = jwt.verify(token, process.env.JWT_SECTRET)
           console.log('decode : ', decode);
           req.user = await userDb.findById(decode.id).select('-password')
           next()
       } catch (error) {
           res.status(401).json({ message: 'invalid token or expiroed token ' })
       }
   
}