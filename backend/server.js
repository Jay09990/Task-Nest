import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
