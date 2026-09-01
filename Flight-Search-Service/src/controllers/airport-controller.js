const {StatusCodes}=require('http-status-codes');
const {AirportService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');

/**
 *  POST: /airports
 *  req-body: {name:'IGI',code:'DEL',city_id:5}
 */

async function createAirport(req,res){
    try {
        console.log(req.body);
        const airport=await AirportService.createAirport({
            name:req.body.name,
            code:req.body.code,
            address:req.body.address,
            city_id:req.body.city_id
        });
        SuccessResponse.data=airport;
        SuccessResponse.message="Successfully created an airport";
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

/**
 *  GET: /airports
 *  req-body: {}
 */

async function getAirports(req,res){
    try{
        const airport=await AirportService.getAirports();
        SuccessResponse.data=airport;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

/**
 *  GET: /airports/:id
 *  req-body: {}
 */

async function getAirport(req,res){
    try{
        const airport=await AirportService.getAirport(req.params.id);
        SuccessResponse.data=airport;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

/**
 *  DELETE: /airports/:id
 *  req-body: {}
 */

async function destroyAirport(req,res){
    try{
        const airport=await AirportService.destroyAirport(req.params.id);
        SuccessResponse.data=airport;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse)
    } 
    catch(error){
        ErrorResponse.error=error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse)
    }
}

module.exports={
    createAirport,
    getAirports,
    getAirport,
    destroyAirport
}