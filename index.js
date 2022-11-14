import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";
import dayjs from 'dayjs';
import dotenv from "dotenv";
import Joi from 'joi'


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {

    await mongoClient.connect();
    db = mongoClient.db("apiUol");

} catch (err) {

    console.log(err);

}

/* set global var */

const users = db.collection("users");
const messages = db.collection("messages");

/* set joi format */

const userJoi = Joi.object({
    name: Joi.string().min(1).required()
});

const messageJoi = Joi.object({
    to: Joi.string().required().min(1),
    text: Joi.string().required().min(1),
    type: Joi.string().required().valid("message", "private_message")
});

app.post("/participants", async (req, res) => {

    const user = req.body;
    console.log(user)

    try {

        const userTime = Date.now();
        const formatTime = dayjs(userTime).format("HH:mm:ss")
        const verifyUser = await users.findOne({ name: user.name });

        if (verifyUser) {
            return res.status(409).send({ message: 'User já utilizado, favor escolher um diferente!' })
        }

        const validation = userSchema.validate(userJoi, { abortEarly: false });

        if (validation.error) {
            const vlError = validation.error.details.map(
                (err) => err.message
            );
            return res.status(400).send(vlError);
        }

        await users.insertOne({ ...user, lastStatus: userTime });
        await messages.insertOne({
            from: user.name,
			to: 'Todos',
			text: 'entra na sala...',
			type: 'status',
			time: formatTime
        });
        res.sendStatus(201);


    } catch (err) {

        console.log(err);
        res.sendStatus(500);

    }

});

app.get("/participants", async (req, res) => {



});

app.post("/messages", async (req, res) => {



});

app.get("/messages", async (req, res) => {



});

app.post("/status", async (req, res) => {



});

/* setInterval((), 15000); */




app.listen(5000, console.log("Server running at port: 5000"));