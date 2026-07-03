require('dotenv').config();
const express = require('express');
const cors = require('cors');


const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

const PORT = 5000;
const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('PostgreSQL connect successfully');
    })
    .catch(err => {
        console.error('PostgreSQL connect failed：', err);
    });

app.get('/', (req, res) => {
    res.send('Server is working');
});



app.listen(PORT, () => console.log(`Backend server is running at http://localhost:${PORT}`));