const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const deviceRoute = require("./routes/deviceRoutes");
const userRoute = require("./routes/userRoutes");
//middleware
app.use(cors()); // Include CORS if needed
app.use(express.json());
app.use("/", deviceRoute);
app.use("/auth", userRoute);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;
mongoose
  .connect(
    "mongodb+srv://tve22cs089:collegeofengineeringtvm@probonodata.zn5kwew.mongodb.net/?retryWrites=true&w=majority&appName=proBonoData"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running");
    });
    console.log("Connection of Mongoatlas established");
  })
  .catch(() => {
    console.log("Connection failed");
  });
app.get("/", (req, res) => {
  res.send("Server is running");
});
