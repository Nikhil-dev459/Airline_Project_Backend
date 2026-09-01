const {StatusCodes}=require('http-status-codes');
const TicketService=require('../services/email-services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');

const create=async(req,res)=>{
    try{
        const response=await TicketService.createNotification(req.body);
        SuccessResponse.data=response;
        SuccessResponse.message="Successfully created an email reminder";
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse)
    } 
    catch(error){
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

const getAll=async(req,res)=>{
    try{
        const response=await TicketService.getAllNotifications();
        SuccessResponse.data=response;
        SuccessResponse.message="Successfully fetched email reminders";
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        ErrorResponse.error=error;
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse)
    }
}

module.exports={
    create,
    getAll
}