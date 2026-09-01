const sender=require('../../config/email-config');
const cron=require('node-cron');
const emailService=require('../../services/email-services');
const {Enums}=require('./index');
const {PENDING,SUCCESS,FAILED}=Enums.NOTIF_STATUS;

/**
 * 10:00 AM
 * Every 5 minutes
 * We will check are there any pending emails, which were expected to be sent by now and are pending
 */

const setupJobs=()=>{
    cron.schedule('*/2 * * * *',async()=>{
        const response=await emailService.fetchPendingEmails();
        response.forEach((email)=>{
            sender.sendMail({
                to:email.recepientEmail,
                subject:email.subject,
                content:email.content
            },async(err,data)=>{
                if(err) console.log(err);
                else{
                    console.log(data);
                    await emailService.updateStatus(email.id,{status:SUCCESS});
                }
            });
        });
        console.log(response);
    });
}

module.exports=setupJobs;