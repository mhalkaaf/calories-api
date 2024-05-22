import { router } from './src/routes.js';
// import { router as loginRoute } from './src/loginroutes.js';

import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello Folks!")
});

app.use('/api', router);

// app.use('/api/login', loginRoute);

app.listen(port, () => console.log(`App listening on port ${port}`));