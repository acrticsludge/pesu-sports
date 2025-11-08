import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

dotenv.config();

const app = express();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let collection;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db("pesu_sports_data");
    collection = db.collection("users");
  } catch (err) {
    console.error("Failed to connect", err);
    process.exit(1); // Exit if cannot connect
  }
}

async function startServer() {
  await connectDB();

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      secret: process.env.KEY,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: client, // already connected client instance
        dbName: "pesu_sports_data",
        collectionName: "sessions",
        ttl: 30 * 60, // 30 minutes
      }),
      cookie: {
        maxAge: 30 * 60 * 1000, // 30 minutes in ms
        httpOnly: true,
        secure: false, // false for HTTP development; true in production HTTPS
        sameSite: "lax", // "lax" allows cookies on regular cross-site requests like navigation
      },
    })
  );

  app.post("/register", async (req, res) => {
    try {
      const { username, srn, email, password, confirm } = req.body;

      if (!username || !srn || !email || !password || !confirm) {
        return res
          .status(400)
          .json({ message: "One or more fields are empty!" });
      }
      if (password !== confirm) {
        return res.status(400).json({ message: "Passwords do not match!" });
      }

      if (await collection.findOne({ srn })) {
        return res.status(400).json({ error: "SRN already registered" });
      }

      if (await collection.findOne({ email })) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      await collection.insertOne({
        username,
        srn,
        email,
        password: hashedPassword,
        user: "regular",
        createdAt: new Date(),
      });

      // Fetch inserted user to get accurate info for session
      const insertedUser = await collection.findOne({ email });

      // Set session user with inserted user data
      req.session.user = {
        srn: insertedUser.srn,
        email: insertedUser.email,
        username: insertedUser.username,
      };

      // Save session before responding
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Session save error" });
        }
        console.log("User registered:", insertedUser.email);
        res.status(201).json({
          message: "User registered successfully!",
          user: req.session.user,
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register user." });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { srn, email, password } = req.body;
      if (!srn || !email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password required." });
      }

      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      req.session.user = {
        srn: user.srn,
        email: user.email,
        username: user.username,
      };

      req.session.save((err) => {
        if (err) return res.status(500).json({ message: "Session save error" });

        res.json({
          user: req.session.user,
          message: "Login successful",
          color: "green",
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed. Try again." });
    }
  });

  app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/current-user", (req, res) => {
    if (req.session && req.session.user) {
      console.log("Current user:", req.session.user);
      return res.json({ loggedIn: true, user: req.session.user });
    }
    res.json({ loggedIn: false, user: null });
  });
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
