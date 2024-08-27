let express = require('express');
let app = express();
let allroutes = require('./allroutes');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const { usersModel } = require("../backend/allschemas");

dotenv.config();
app.use(express.json());


let corspolicy = {
    origin:"http://localhost:3000"
}
app.use(cors(corspolicy));

app.use((req,res,next) => {
    console.log(" Request received at " + (new Date()));
    next();
});



let db = async () => { 
    try{ 
        await mongoose.connect("mongodb+srv://Deepak:deepakreddy7842@cluster0.ena8zuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        
        console.log(" connected to database");
    }
    catch(err) {
        console.log(' error connecting');
    }
}
db();

let userSchema = new mongoose.Schema(
    {
      "username": {
        "type": "String",
        "required": true
      },
      "password": {
        "type": "String",
        "required": true
      },
      "email": {
        "type": "String",
        "required": true,
        "unique":true
      },
    
    
    }
);
mongoose.model("usersModel",userSchema);


app.use('/',allroutes);


app.listen(3100,()=>{ console.log("Backend server listening at port 3100")});