const jwt=require('jsonwebtoken');
const authAdminMiddleware=(requiredrole=null)=>{
    return (req,res,next)=>{
        const token=req.header('Authorization')?.split(' ')[1];
        console.log("toke is :",token);
        // const decoded1=jwt.verify(token,process.env.JWT_SECRET);
        // console.log("here",decode);
        if(!token)
            return res.status(401).json({message:'Access denied np token provided'});
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;
            console.log("user role:",req.user.role);
            console.log("required roel is :",requiredrole);
            console.log("req.user.role roel is :",req.user.role);
            if(requiredrole && req.user.role!==requiredrole){
                console.log("in if ");
                res.status(403).json({message:'Access denied inssuuficent permission'});}
            next();
        }        
        catch(error){
            console.log(`Error is : ${error}`);
            return res.status(400).json({message:'Invalid token'});
        }
    }
}
module.exports=authAdminMiddleware;