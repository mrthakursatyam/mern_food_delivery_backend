import jwt from 'jsonwebtoken'

const authMiddleware = async(req, res, next) => {
    const {token} = req.headers
 
    if(!token){
        return res.json({success:false, message:"You are authorized, login again!"})
    }

    try{
        const token_decode = jwt.verify( token, process.env.JWT_SECRET)
        req.body.userId = token_decode.userId
        next()
    }
    catch(err){
        return res.json({success:false, message: err.message})
    }
}

export default authMiddleware