import jwt from 'jsonwebtoken'
export const generateToken = (userId) =>{
    return jwt.sign({id: userId},process.env.JWT_SECTRET,
        {expiresIn :'10d'} )
}