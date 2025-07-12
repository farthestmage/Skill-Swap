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
const authentication = require("./middleware/authenticateToken.js");
const auth = require("./routes/auth.route.js");
app.use("/auth", auth);
const constants = require("./routes/constants.route.js");
app.use("/api/constants",authentication,constants);
const users = require("./routes/users.route.js");
app.use("/api/users", authentication,users);
const requests = require("./routes/requests.route.js");
app.use("/api/request", authentication,requests);
const personal = require("./routes/personal.route.js");
app.use("/api/personal", authentication,personal);
const review = require("./routes/reviews.route.js");
app.use("/api/review", authentication,review);

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
