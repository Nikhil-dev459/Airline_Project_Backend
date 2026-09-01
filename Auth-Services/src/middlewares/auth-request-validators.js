const {StatusCodes}=require('http-status-codes');
const {ErrorResponse}=require('../utils/common');
const AppError=require('../utils/error/app-error');

const validateUserAuth=(req,res,next)=>{
    if(!req.body.email||!req.body.password){
        ErrorResponse.message="Something went wrong";        
        ErrorResponse.error=new AppError(["Email or password missing in the request"],StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

const validateIsAdminRequest=(req,res,next)=>{
    if(!req.body.id){
        ErrorResponse.message="Something went wrong";        
        ErrorResponse.error=new AppError(["User ID missing in the request"],StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

module.exports={
    validateUserAuth,
    validateIsAdminRequest
}