const express=require('express');

const {serverConfig}=require('./config');
const apiRoutes=require('./routes');
const CRONS=require('./utils/common/cron-jobs');

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));   //makes sure to read the url encoded stuff

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, x-idempotency-key');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/api/v1/home',(req,res)=>{
    return res.json({message:'Hitting the booking service'});
})
app.use('/api',apiRoutes);

app.listen(serverConfig.PORT,()=>{
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
    //Logger.info("Successfully started the server","root",{});
    CRONS();
});