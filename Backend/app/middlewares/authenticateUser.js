import jwt from 'jsonwebtoken'

const authenticateUser = (req,res,next)=>{
    let token = req.headers['authorization'];
    // console.log(token)
    if(!token){
        return res.status(401).json({errors:'token not provided'})
    }
    token = token.split(' ')[1];
    try{
        const tokenData = jwt.verify(token,process.env.SECRET_KEY);
        req.currentUser = {userId : tokenData.userId,role : tokenData.role}
        // console.log(req.currentUser)
        next()
    }
    catch(err){
        return res.status(401).json({errors:err.message})
    }
    
}   

export default authenticateUser;