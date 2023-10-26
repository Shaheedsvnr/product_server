const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo()
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/super',require('./Routes/superRouter'));
app.use('/api/admin',require('./Routes/adminRoutes'));
app.use('/api/product',require('./Routes/productRoutes'));
app.use('/api/catagory',require('./Routes/catagoriesRoutes'));
app.use('/uploads/product',express.static('./uploads/product'));
app.use('/uploads/admin',express.static('./uploads/admin'));
app.use('/uploads/super',express.static('./uploads/super'));
app.get("/hy",(req,res)=>{
    console.log("hy");
})
const port = 5000;
app.listen(port,()=>{
    console.log('------------------------------');
    console.log("Server is running on port "+port);
});