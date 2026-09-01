const {User,Role}=require('../models/index');
const AppError=require('../utils/error/app-error');
const {StatusCodes}=require('http-status-codes');

class UserRepository{
    async create(data){
        try{
            const user=await User.create(data);
            return user;
        } 
        catch(error){
            if(error.name=='SequelizeValidationError'){
                let explanation=[];
                error.errors.forEach(err => {
                    explanation.push(err.message);
                });
                throw new AppError(explanation,StatusCodes.BAD_REQUEST);
            }
            console.log("Something went wrong at the repository layer");
            throw error;
        }
    }

    async destroy(userId){
        try{
            await User.destroy({
                where:{
                    id:userId
                }
            });
            return true;
        } 
        catch(error){
            console.log("Something went wrong on the repository layer");
            throw error;    
        }
    }

    async getById(userId){
        try{
            const user=await User.findByPk(userId,{
                attributes:['email','id']
            });
            return user;
        } 
        catch(error){
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }

    async getByEmail(userEmail){
        try{
            const user=await User.findOne({
                where:{
                    email:userEmail
                }
            });
            return user;
        } 
        catch(error){
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }

    async isAdmin(userId){
        try{
            const user=await User.findByPk(userId);
            const adminRole=await Role.findOne({
                where:{
                    name:'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } 
        catch(error){
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }
}

module.exports=UserRepository;