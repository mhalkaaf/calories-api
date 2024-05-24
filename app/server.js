
import express from 'express';
import cors from 'cors';
import { router } from './src/routes/routes.js';
import "dotenv/config.js";
import bodyparser from 'body-parser';

const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send("Hello Folks!")
});

app.use('/api', router);

// app.use('/api/login', loginRoute);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});