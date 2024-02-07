import express from 'express'

const app = express();

// middleware
app.use(express.json());

// connection and listener
app.listen(5000, () => console.log("AI ChatBot Server Open"))