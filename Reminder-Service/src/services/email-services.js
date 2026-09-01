const sender=require('../config/email-config');
const TicketRepository=require('../repositories/ticket-repository');
const {Enums}=require('../utils/common');
const {PENDING,SUCCESS,FAILED}=Enums.NOTIF_STATUS;
const AppError=require('../utils/error/app-error');
const {StatusCodes}=require('http-status-codes');

const repo=new TicketRepository();

const sendBasicEmail=async(mailFrom,mailTo,mailSubject,mailBody)=>{
    try{
        const response=await sender.sendMail({
            from:mailFrom,
            to:mailTo,
            subject:mailSubject,
            text:mailBody
        });
        console.log(response);
    } 
    catch(error){
        throw new AppError('Failed to send email',StatusCodes.INTERNAL_SERVER_ERROR);
    } 
}

const fetchPendingEmails=async(timestamp)=>{
    try{
        const response=await repo.get({status:PENDING});
        return response;
    } 
    catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Unable to fetch pending emails',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const updateStatus=async(ticketId,data)=>{
    try{
        const response=await repo.update(ticketId,data);
        return response;
    } 
    catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Unable to update ticket status',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const createNotification=async(data)=>{
    try{
        const response=await repo.create(data);
        return response;
    } 
    catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Unable to create notification',StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}

const subscribeEvents=async(payload)=>{
    try{
        let service=payload.service;
        let data=payload.data;
        switch(service){
            case 'CREATE_TICKET':
                await createNotification(data);
                break;
            case 'SEND_BASIC_MAIL':
                await sendBasicEmail(
                    data.mailFrom,
                    data.mailTo,
                    data.mailSubject,
                    data.mailBody
                );
                break;
            default:
                throw new AppError('Invalid event received',StatusCodes.BAD_REQUEST);
        }
    } 
    catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Failed to process event',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const getAllNotifications=async()=>{
    try{
        const response=await repo.getAll();
        return response;
    } 
    catch(error){
        throw new AppError('Unable to fetch notifications',StatusCodes.INTERNAL_SERVER_ERROR); 
    }
}

module.exports={
    sendBasicEmail,
    fetchPendingEmails,
    updateStatus,
    createNotification,
    getAllNotifications,
    subscribeEvents
}

/**
 * SMTP -> a@b.com
 * receiver -> d@e.com
 * 
 * from: support@noti.com
 */