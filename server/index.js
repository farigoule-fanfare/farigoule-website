const express = require('express');
const compression = require('compression')

const routes = require('./routes/routes')


const app = express()

// compress responses
app.use(compression())
// enable bodyParser
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/route", routes);



app.use("/", (req, res) => {
    res.send("Server is running")
})

app.listen(5000, console.log("Server is running on port 5000"))