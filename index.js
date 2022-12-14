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

    try {

        const userTime = Date.now();
        const formatTime = dayjs(userTime).format("HH:mm:ss")
        const verifyUser = await users.findOne({ name: user.name });

        if (verifyUser) {
            return res.status(409).send({ message: 'User já utilizado, favor escolher um diferente!' })
        }

        const validation = userJoi.validate(user, { abortEarly: false });

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

    try {

        const usersList = await users.find({}).toArray();
        res.send(usersList);

    } catch (err) {

        console.log(err);
        res.sendStatus(500);

    }

});

app.post("/messages", async (req, res) => {

    const message = req.body;
    const { user } = req.headers;

    try {

        const exist = await users.findOne({ name: user });
        const formatTime = dayjs().format('HH:mm:ss');

        if (!exist) {
            return res.status(422).send({ message: "User is not connected" });
        }

        const validation = messageJoi.validate(message, { abortEarly: false });
        if (validation.error) {
            const vlError = validation.error.details.map(
                (err) => err.message
            );
            return res.status(400).send(vlError);
        }

        await messages.insertOne({
            ...message,
            from: user,
            time: formatTime,
        });

        res.sendStatus(201);

    } catch (err) {

        console.log(err);
        res.sendStatus(500);

    }

});

app.get("/messages", async (req, res) => {

    let newLimit = 0;
    const { limit } = req.query;
    const user = req.get("User");

    if (limit) {
        newLimit = parseInt(limit);
    }

    try {

        const messageList = await messages.find({ from: user }).limit(newLimit).toArray()
        res.send(messageList);

    } catch (err) {

        res.sendStatus(500);

    }


});

app.post("/status", async (req, res) => {

    const user = req.get("User")
    try {
        const stats = await users.findOne({ name: user })
        if (stats === null) {
            res.status(404);
        } else {
            await users.updateOne({ _id: stats._id }, { $set: { lastStatus: Date.now() } })
            res.status(200);
        }

    } catch (err) {

        console.log(err);
        res.sendStatus(500);

    }

});

setInterval(async () => {

    try {
        const date = Date.now()
        const formatDate = dayjs(date).format('HH:mm:ss');
        const listUsers = await users.find().toArray();
        listUsers.forEach(async (props) => {
            if (date - props.lastStatus > 10000) {
                await messages.insertOne({
                    from: props.name,
                    to: 'Todos',
                    text: 'sai da sala...',
                    type: 'status',
                    time: formatDate,
                });

            }

            await users.deleteOne({ name: props.name });
        })


    } catch (err) {

        console.log(err);

    }

}, 15000);




app.listen(5000, console.log("Server running at port: 5000"));