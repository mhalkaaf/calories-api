const express = require('express')
const apiRoutes = require('./src/routes')
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Folks!")
});

app.use("/api", apiRoutes);

app.listen(port, () => console.log(`App listening on port ${port}`));