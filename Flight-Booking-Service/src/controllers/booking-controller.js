const {StatusCodes}=require('http-status-codes');
const {BookingService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');
const inMemDb={};

const {createChannel,publishMessage}=require('../utils/common/messageQueue');
const {REMINDER_BINDING_KEY}=require('../config/server-config');

class BookingController{

    constructor(){
    }

    async sendMessageToQueue(req,res){
        try{
            const channel=await createChannel();
            const payload={
                data:{
                    subject:'This is a notification from queue',
                    content:'Some queue will subscribe this',
                    recepientEmail:'abc@gmail.com',           //INSERT Valid email here
                    notificationTime: '2026-06-15T01:00:00'
                },
                service:'CREATE_TICKET'
            };
            await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
            SuccessResponse.data=payload;
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        } 
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode)
                    .json(ErrorResponse);
        }
    }

    async createBooking(req,res){
        try{
            console.log(req.body);
            const response=await BookingService.createBooking({
                flightId:req.body.flightId,
                userId:req.body.userId,
                noOfSeats:req.body.noOfSeats
            });
            SuccessResponse.data=response;
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        }
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode)
                    .json(ErrorResponse);
        }
    }

    async makePayment(req,res){
        try{
            const idempotencyKey=req.headers['x-idempotency-key'];
            if(!idempotencyKey){
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({message:'Idempotency key missing'});
            }
            if(inMemDb[idempotencyKey]){
                return res
                    .status(StatusCodes.CONFLICT)
                    .json({message:'Cannot retry on a successful payment'});
            }
            const response=await BookingService.makePayment({
                totalCost:req.body.totalCost,
                userId:req.body.userId,
                bookingId:req.body.bookingId
            });
            inMemDb[idempotencyKey]=idempotencyKey;
            SuccessResponse.data=response;
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        }
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode)
                    .json(ErrorResponse);
        }
    }

    async getBooking(req,res){
        try{
            const response=await BookingService.getBooking(req.params.id);
            SuccessResponse.data=response;
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        }
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(ErrorResponse);
        }
    }

    async getAllBookings(req,res){
        try{
            const response=await BookingService.getAllBookings();
            SuccessResponse.data=response;
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        }
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(ErrorResponse);
        }
    }

    async getUserBookings(req,res){
        try{
            const response=await BookingService.getUserBookings(req.params.userId);
            SuccessResponse.data=response;
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        }
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(ErrorResponse);
        }
    }

    async cancelBooking(req,res){
        try{
            const response=await BookingService.cancelBooking(req.params.id);
            SuccessResponse.data=response;
            SuccessResponse.message="Successfully cancelled booking";
            return res
                    .status(StatusCodes.OK)
                    .json(SuccessResponse);
        }
        catch(error){
            ErrorResponse.error=error;
            return res
                    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                    .json(ErrorResponse);
        }
    }
}

module.exports=BookingController;