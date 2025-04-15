import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();


import userRoutes from './routes/users.js';
import carRoutes from './routes/cars.js';

app.use('/api/user', userRoutes);
app.use('/api/cars', carRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})