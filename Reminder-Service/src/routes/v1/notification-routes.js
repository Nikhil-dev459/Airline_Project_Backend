const express=require('express');
const { TicketController } = require('../../controllers');

const router=express.Router();

//api/v1/tickets ->POST
router.post('/',
            TicketController.create);

//api/v1/tickets ->GET
router.get('/',
            TicketController.getAll);

module.exports=router;