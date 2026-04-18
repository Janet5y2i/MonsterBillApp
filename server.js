const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const psw = '1mstb1569'
const dbUrl = 'mongodb+srv://monsterbilldb:' + psw + '@cluster0.mn7rtog.mongodb.net/?appName=Cluster0'

app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(dbUrl)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


// define a schema for the user data
const recordSchema = new mongoose.Schema({
    amount: Number,
    name: String,
    date: String
});


//
app.post('/add-ind-record', async(req, res) => {
    try{
        const indReocrd = new recordSchema(requ.body);

        await indRecord.save();
        res.status(200).json({ message: 'Record saved successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving record', error: err });
    }
});