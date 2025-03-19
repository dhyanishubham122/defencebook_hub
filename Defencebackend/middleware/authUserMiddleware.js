const jwt =require('jsonwebtoken');
const authUserMiddleware=(req,res,next)=>{
    // const token=req.header('Authorization');
    const token=req.header('Authorization')?.split(' ')[1];

    if(!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        } 
        catch (error ) {
            return res.status(403).json({ message: "Invalid or Expired Token" });
        }

}
module.exports=authUserMiddleware;