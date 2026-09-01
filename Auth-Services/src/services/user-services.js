const UserRepository=require('../repositories/user-repository');
const jwt=require('jsonwebtoken');
const {JWT_KEY}=require('../config/server-config');
const bcrypt=require('bcrypt');
const AppError=require('../utils/error/app-error');
const {StatusCodes}=require('http-status-codes');

class UserService{
    constructor(){
        this.UserRepository=new UserRepository;
    }

    async create(data){
        try {
            const user=await this.UserRepository.create(data);
            return user;    
        } 
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            throw new AppError("Cannot create a User object",StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async signIn(email,password){
        try{
            //step 1-> fetch the user using the email
            const user=await this.UserRepository.getByEmail(email);
            if(!user){
                throw new AppError("User with given email does not exist",StatusCodes.NOT_FOUND);
            }
            //step 2-> compare incoming plain password with stored encrypted password
            const passwordsMatch=this.checkPassword(password,user.password);
            if(!passwordsMatch){
                throw new AppError("Passwords don't match",StatusCodes.UNAUTHORIZED);
            }
            //step 3-> if passwords match, then create a token and send it to the user
            const newJWT=this.createToken({email:user.email,id:user.id});
            return newJWT;
        } 
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            throw new AppError("Something went wrong in the sign-in process",StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async isAuthenticated(token){
        try{
            const response=this.verifyToken(token);
            if(!response){
                throw new AppError("Invalid token",StatusCodes.UNAUTHORIZED);
            }
            const user=await this.UserRepository.getById(response.id);
            if(!user){
                throw new AppError("No user with corresponding token exists",StatusCodes.NOT_FOUND);
            }
            return user.id;
        } 
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            throw new AppError("Authentication failed",StatusCodes.UNAUTHORIZED);
        }
    }

    createToken(user){
        try{
           const result=jwt.sign(user,JWT_KEY,{expiresIn:'1d'});
           return result;
        } 
        catch(error){
            throw new AppError("Failed to create token",StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    verifyToken(token){
        try{
           const response=jwt.verify(token,JWT_KEY);
           return response; 
        } 
        catch(error){
            throw new AppError("Invalid or expired token",StatusCodes.UNAUTHORIZED);
        }
    }

    checkPassword(userInputPlainPassword,encryptedPassword){
        try{
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
        } 
        catch(error){
            throw new AppError("Password comparison failed",StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    isAdmin(userId){
        try{
            return this.UserRepository.isAdmin(userId);
        } 
        catch(error){
            if(error instanceof AppError){
                throw error;
            }
            throw new AppError("Unable to verify admin privileges",StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports=UserService;