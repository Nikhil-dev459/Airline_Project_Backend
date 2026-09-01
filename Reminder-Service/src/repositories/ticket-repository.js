const {NotificationTicket}=require('../models/index');
const {Op}=require('sequelize');
const AppError=require('../utils/error/app-error');
const {StatusCodes}=require('http-status-codes');

class TicketRepository{
    async getAll(){
        try{
           const ticket=await NotificationTicket.findAll();
           return ticket; 
        } 
        catch(error){
            throw error;    
        }
    }

    async create(data){
        try{
           const ticket=await NotificationTicket.create(data);
           return ticket; 
        } 
        catch(error){
            if(error.name=='SequelizeValidationError'){
                const explanation=error.errors.map(
                    err=>err.message
                );
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
            }
            throw error;               
        }
    }

    async get(filter){
        try{
            const tickets=await NotificationTicket.findAll({
                where:{
                    status:filter.status,
                    notificationTime:{
                        [Op.lte]:new Date()
                    }
                }
            });
            return tickets;
        } 
        catch(error){
            throw error;
        }
    }

    async update(ticketId,data){
        try{
            const tickets=await NotificationTicket.findByPk(ticketId);
            if(!tickets){
                throw new AppError('Notification ticket not found',StatusCodes.NOT_FOUND);
            }
            if(data.status) tickets.status=data.status;
            await tickets.save();
            return tickets;
        }
        catch(error){
            throw error;
        }
    }
}

module.exports=TicketRepository;