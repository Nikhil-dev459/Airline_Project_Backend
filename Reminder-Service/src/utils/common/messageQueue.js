const amqplib=require('amqplib');
const{MESSAGE_BROKER_URL,EXCHANGE_NAME,QUEUE_NAME}=require('../../config/server-config');

const createChannel=async()=>{
    try{
        const connection=await amqplib.connect(MESSAGE_BROKER_URL);
        connection.on('error',(err)=>{
            console.error('RabbitMQ Connection Error:',err);
        });
        connection.on('close',()=>{
            console.error('RabbitMQ Connection Closed');
        });
        const channel=await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'direct',false);
        return channel; 
    } 
    catch(error){
        throw error;
    }
}

const subscribeMessage=async(channel,service,binding_key)=>{
    try{
        const applicationQueue=await channel.assertQueue(QUEUE_NAME);

        await channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);

        channel.consume(applicationQueue.queue,async(msg)=>{
            try{
                console.log('Received data');
                console.log(msg.content.toString());
                const payload=JSON.parse(msg.content.toString());
                await service(payload);
                channel.ack(msg); 
            } 
            catch(error){
                console.log('Message Processing Error:',error);
                channel.nack(msg,false,true);
            }
        }); 
    } 
    catch(error){
        throw error;
    }
}

const publishMessage=async(channel,binding_key,message)=>{
    try{
        await channel.assertQueue(QUEUE_NAME);
        channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
    } 
    catch(error){
        throw error;
    }
}

module.exports={
    createChannel,
    subscribeMessage,
    publishMessage
}