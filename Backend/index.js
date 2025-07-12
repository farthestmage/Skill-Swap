const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",").map(
  (origin) => origin.trim(),
) || ["http://localhost:5173"];
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const io = new socket.Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  app.set("socket", socket);
});


//Express Middlewares for recieving and parsing json and form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Different Routes
const authenticateToken = require("./middleware/authenticateToken.js");
const devices = require("./routes/devices.route.js");
app.use("/devices", authenticateToken, devices);
const templates = require("./routes/templates.route.js");
app.use("/templates", authenticateToken, templates);
const deviceDashboard = require("./routes/device-dashboards.route.js");
app.use("/device-dashboards", deviceDashboard);
const users = require("./routes/users.route.js");
app.use("/users", users);
const constants = require("./routes/constants.route.js");
app.use("/constants", constants);

//Connecting the Database
const client = require("./service/db.js");
const redis = require("./service/redis.js");
redis.on("connect", () => {
  console.log("Connected to Redis");
});
redis.on("error", (err) => {
  console.error("Redis client encountered an error:", err);
});
client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

//Starting the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server Started at ${PORT}`));

