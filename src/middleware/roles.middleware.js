export const authorizedRoles=(...allowedRoles)=>{
return (req,res,next)=>{
if(!req.user|| !allowedRoles.include(req.user.role)){
    return res.status(403).json({message:"forbidden insufficient role"})
}
next();
}
}