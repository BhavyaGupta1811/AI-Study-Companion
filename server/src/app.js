const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studyRoomRoutes = require("./routes/studyRoomRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware"); 

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/study-rooms", studyRoomRoutes);
app.use("/api/v1/study-sessions", studySessionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running Successfully",
  });
});

app.use(notFound);

app.use(errorHandler);

module.exports = app;
