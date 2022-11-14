import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dayjs from 'dayjs';
import dotenv from "dotenv";
import joi from 'joi'


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {

    await mongoClient.connect();
    db = mongoClient.db("Papos");

} catch (err) {

    console.log(err);

}

app.post("/participants", async (req, res) => {



});

app.get("/participants", async (req, res) => {



});

app.post("/messages", async (req, res) => {



});

app.get("/messages", async (req, res) => {



});

app.post("/status", async (req, res) => {



});

setInterval((), 15000);




app.listen(5000, console.log("Server running at port: 5000"));