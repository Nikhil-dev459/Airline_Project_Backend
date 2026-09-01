const UserService=require('../services/user-services');
const {StatusCodes}=require('http-status-codes');
const {SuccessResponse,ErrorResponse}=require('../utils/common');

const userService=new UserService();

const create=async(req,res)=>{
    try{
        const response=await userService.create({
            email:req.body.email,
            password:req.body.password
        });
        SuccessResponse.data=response;
        SuccessResponse.message="Successfully created a new user";
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse)
    } 
    catch(error){
        console.log(error);
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

const signIn=async(req,res)=>{
    try{
        const response=await userService.signIn(req.body.email,req.body.password);
        SuccessResponse.data=response;
        SuccessResponse.message="Successfully signed in";
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        console.log(error);
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

const isAuthenticated=async(req,res)=>{
    try{
        const token=req.headers['x-access-token'];
        const response=await userService.isAuthenticated(token);
        SuccessResponse.data=response;
        SuccessResponse.message="User is authenticated and token is valid";
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        console.log(error);
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

const isAdmin=async(req,res)=>{
    try{
        const response=await userService.isAdmin(req.body.id);
        SuccessResponse.data=response;
        SuccessResponse.message="Successfully fetched whether user is admin or not";
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        console.log(error);
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

module.exports={
    create,
    signIn,
    isAuthenticated,
    isAdmin
}