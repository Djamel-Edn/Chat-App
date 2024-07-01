const jwt=require('jsonwebtoken');
exports.cookieJwtAuth=(req,res,next)=>{
    const token=req.cookies.token;
    console.log('token:',token)
    console.log('req.cookies:',req.cookies)
    if(!token){
        return res.status(401).json({error:"Unauthorized"})
    }
    try{
        const user=jwt.verify(token,process.env.MY_SECRET);
        req.user=user;
        next();
    }catch(error){
        console.log(error);
        return res.redirect('/login')
    }
}