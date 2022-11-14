import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dayjs from 'dayjs';
import dotenv from "dotenv";
import joi from 'joi'


const app = express();

app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

try {

    await mongoClient.connect();
    db = mongoClient.db("Papos")
    
} catch (err) {

    console.log(err)

}




app.listen(5000, console.log("Server running at port: 5000"));