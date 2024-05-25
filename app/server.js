
import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import { router } from './src/routes/routes.js';
import "dotenv/config.js";


const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// default root
app.get('/', (req, res) => {
    res.send("Hello Folks!")
});

// api request
app.use('/api', router);

// Port listering
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});