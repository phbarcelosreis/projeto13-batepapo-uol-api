import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("")
}).catch((err) => console.log(err));




app.listen(5000, console.log("Server running at port: 5000"));