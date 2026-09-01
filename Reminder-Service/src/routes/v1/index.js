const express=require('express');

const {InfoController}=require('../../controllers');

const notificationRoutes=require('./notification-routes');

const router=express.Router();

router.use('/tickets',notificationRoutes);
router.get('/info',InfoController.info);

module.exports=router;