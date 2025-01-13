const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const managerRoutes = require("./routes/manager.route");
const pantryRoutes = require("./routes/pantry.route");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://assignment-frontend-gamma-six.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin);
  },
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/manager", managerRoutes);
app.use("/api/v1/pantry", pantryRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
