const {AirplaneRepository}=require('../repositories');
const AppError=require('../utils/error/app-error');
const {StatusCodes}=require('http-status-codes');

const airplaneRepository=new AirplaneRepository();

async function createAirplane(data){
    try{
        const airplane=await airplaneRepository.create(data);
        return airplane;
    }
    catch(error){
        //console.log(error);
        if(error.name=='SequelizeValidationError'){
            let explanation=[];
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError("Cannot create an Airplane object",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes(){
    try{
       const airplane=await airplaneRepository.getAll();
       return airplane; 
    } 
    catch(error){
        throw new AppError("Cannot fetch data of all airplanes",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplane(id){
    try{
       const airplane=await airplaneRepository.get(id);
       return airplane; 
    } 
    catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The airplane you requested is not present',error.statusCode);
        }
        throw new AppError("Cannot fetch data of given airplane",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirplane(id){
    try{
       const response=await airplaneRepository.destroy(id);
       return response; 
    } 
    catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The airplane you requested to delete is not present',error.statusCode);
        }
        throw new AppError("Cannot fetch data of given airplane",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirplane(id,data){
    try{
       const response=await airplaneRepository.update(id,data);
       return response; 
    } 
    catch(error){
        if(error.statusCode==StatusCodes.NOT_FOUND){
            throw new AppError('The airplane you requested to update is not present',error.statusCode);
        }
        throw new AppError("Cannot fetch data of given airplane",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}