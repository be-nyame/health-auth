const express = require("express");
require("./config/dbConnect");
const authRoute = require("./route/authRoute");
// const cors = require("cors");

const app = express();

// Allow cross-domain requests
// app.use(cors);  //to be used with Angular 
app.use(express.json()); // Parse in as json format

app.use("/auth", authRoute);

app.listen(4000, () => console.log("Server is up and running"));