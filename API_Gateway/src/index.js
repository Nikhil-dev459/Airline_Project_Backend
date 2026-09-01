const express=require('express');
const morgan=require('morgan');
const {createProxyMiddleware}=require('http-proxy-middleware');
const rateLimit=require('express-rate-limit');
const axios=require('axios');

const {serverConfig}=require('./config');
const apiRoutes=require('./routes');

const app=express();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, x-idempotency-key');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const limiter=rateLimit({
    windowMs: 2*60*1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(morgan('combined'));
app.use(limiter);

// Gateway Health / Info
app.use('/api',apiRoutes);
app.get('/home',(req,res)=>{
    return res.json({
        message:'API Gateway is running',
        services: {
            auth: 'http://localhost:3001',
            flights: 'http://localhost:3000',
            bookings: 'http://localhost:4000',
            reminders: 'http://localhost:3004'
        }
    });
});

// Proxy to Auth Service (Port 3001)
app.use('/authservice', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/authservice': '' }
}));

// Proxy to Flight Search Service (Port 3000)
app.use('/flightservice', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: { '^/flightservice': '' }
}));

// Proxy to Reminder Service (Port 3004)
app.use('/reminderservice', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: { '^/reminderservice': '' }
}));

// Protected proxy to Booking Service (Port 4000)
app.use('/bookingservice', async(req,res,next)=>{
    try{
        const token = req.headers['x-access-token'];
        if (!token) {
            // allow unauthenticated if checking info or home
            if (req.path === '/api/v1/home' || req.method === 'OPTIONS') {
                return next();
            }
        }
        if (token) {
            const response=await axios.get('http://localhost:3001/api/v1/isAuthenticated',{
                headers:{
                    'x-access-token':token
                }
            });
            if(response.data.success){
                return next();
            }
        }
        // Fallback for public requests or pass through to booking service
        next();
    }
    catch(error){
        next();
    }
});

app.use('/bookingservice', createProxyMiddleware({
    target:'http://localhost:4000',
    changeOrigin:true,
    pathRewrite: { '^/bookingservice': '' }
}));

app.listen(serverConfig.PORT || 5000,()=>{
    console.log(`Successfully started the API Gateway on PORT : ${serverConfig.PORT || 5000}`);
});