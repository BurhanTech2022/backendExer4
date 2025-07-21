export const authorize = (...roles) =>{
   return (req,res,next) =>{
    if(!roles.includes(req.user.role)){
     return res.status(401).json({message : `Access dened Request of [${roles.join('')}]`})
    }
     res.status(200).json({message: `${req.user.name}: Welcome to admin page`})
    next()
   }
} 