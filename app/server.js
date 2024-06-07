
import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { pool } from './src/database/db.js';
import { router } from './src/routes/routes.js';
import "dotenv/config.js";


const app = express();
const port = 3000;

const PgSession = pgSession(session);

app.use(session({
    store: new PgSession({
        pool: pool, // Connection pool
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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