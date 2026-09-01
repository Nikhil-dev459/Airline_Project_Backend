const express=require('express');
const {BookingController}=require('../../controllers');
const router=express.Router();

const bookingController=new BookingController();

router.post(
    '/',
    bookingController.createBooking
)

router.post(
    '/payment',
    bookingController.makePayment
)

router.get(
    '/',
    bookingController.getAllBookings
)

router.get(
    '/:id',
    bookingController.getBooking
)

router.get(
    '/user/:userId',
    bookingController.getUserBookings
)

router.post(
    '/:id/cancel',
    bookingController.cancelBooking
)

module.exports=router;