import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import cron from "node-cron";

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

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    db = client.db("pesu_sports_data");
  } catch (err) {
    console.error("Failed to connect", err);
    process.exit(1);
  }
}

async function startServer() {
  await connectDB();

  async function updateAllSportsBookingStatuses() {
    const now = new Date();

    function parseTimeSlot(slot) {
      const [start, end] = slot.split("-");
      return {
        startHour: parseInt(start.split(":")[0], 10),
        startMinute: parseInt(start.split(":")[1], 10),
        endHour: parseInt(end.split(":")[0], 10),
        endMinute: parseInt(end.split(":")[1], 10),
      };
    }

    const sportsDocs = await db.collection("logs").find({}).toArray();

    for (const sportDoc of sportsDocs) {
      const sportName = Object.keys(sportDoc).find((key) => key !== "_id");
      if (!sportName) continue;

      const sportData = sportDoc[sportName] || {};
      const scheduled = sportData.scheduled || [];
      const active = sportData.active || [];
      const completed = sportData.completed || [];

      const toActivate = [];
      const stillScheduled = [];

      for (const booking of scheduled) {
        const bookingDate = new Date(booking.bookingDate);
        const { startHour, startMinute } = parseTimeSlot(booking.timeSlot);
        const bookingStart = new Date(bookingDate);
        bookingStart.setHours(startHour, startMinute, 0, 0);

        if (now >= bookingStart) {
          toActivate.push(booking);
        } else {
          stillScheduled.push(booking);
        }
      }

      const toComplete = [];
      const stillActive = [];

      for (const booking of active) {
        const bookingDate = new Date(booking.bookingDate);
        const { endHour, endMinute } = parseTimeSlot(booking.timeSlot);
        const bookingEnd = new Date(bookingDate);
        bookingEnd.setHours(endHour, endMinute, 0, 0);

        if (now >= bookingEnd) {
          toComplete.push(booking);
        } else {
          stillActive.push(booking);
        }
      }

      await db.collection("logs").updateOne(
        { _id: sportDoc._id },
        {
          $set: {
            [`${sportName}.scheduled`]: stillScheduled,
            [`${sportName}.active`]: [...stillActive, ...toActivate],
            [`${sportName}.completed`]: [...completed, ...toComplete],
          },
        }
      );

      console.log(
        `Sport ${sportName}: Moved ${toActivate.length} scheduled->active, ${toComplete.length} active->completed`
      );
    }
  }

  cron.schedule("* * * * *", () => {
    console.log("Ran schedule.");
    updateAllSportsBookingStatuses().catch((err) =>
      console.error("Scheduled update error:", err)
    );
  });

  app.use(express.json());
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      secret: process.env.KEY,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: client,
        dbName: "pesu_sports_data",
        collectionName: "sessions",
        ttl: 30 * 60,
      }),
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    })
  );

  app.post("/register", async (req, res) => {
    try {
      const { username, srn, email, password, confirm } = req.body;
      console.log("body", req.body);
      if (!username || !srn || !email || !password || !confirm) {
        return res
          .status(400)
          .json({ message: "One or more fields are empty!" });
      }
      if (password !== confirm) {
        return res.status(400).json({ message: "Passwords do not match!" });
      }

      if (await db.collection("users").findOne({ srn })) {
        console.log("Duplicate SRN:", srn);
        return res.status(400).json({ error: "SRN already registered" });
      }

      if (await db.collection("users").findOne({ email })) {
        console.log("Duplicate Email:", email);
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.collection("users").insertOne({
        username,
        srn,
        email,
        password: hashedPassword,
        user: "regular",
        createdAt: new Date(),
      });

      const insertedUser = await collection.findOne({ email });

      req.session.user = {
        _id: insertedUser._id,
        createdAt: insertedUser.createdAt,
        accountType: insertedUser.user,
        srn: insertedUser.srn,
        email: insertedUser.email,
        username: insertedUser.username,
      };

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

      const user = await db.collection("users").findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      req.session.user = {
        _id: user._id,
        createdAt: user.createdAt,
        accountType: user.user,
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

  app.post("/api/bookings", async (req, res) => {
    try {
      let id;
      const { sport, section, bookingData } = req.body;

      if (!sport || !section || !bookingData) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      if (sport === "Badminton") {
        id = "691013fab236682c479e1e51";
      } else if (sport === "Basketball") {
        id = "691015adb236682c479e1e55";
      } else if (sport === "TableTennis") {
        id = "691015fab236682c479e1e56";
      } else {
        return res.status(400).json({ error: "Invalid sport" });
      }
      const filter = { _id: new ObjectId(id) };
      const sportDoc = await db.collection("logs").findOne(filter);

      const sportData = sportDoc[sport] || { scheduled: [], active: [] };
      const bookingConflict = sportData.scheduled
        .concat(sportData.active)
        .some(
          (b) =>
            b.court === bookingData.court && b.timeSlot === bookingData.timeSlot
        );

      if (bookingConflict) {
        return res.status(409).json({
          error: "This time slot is already booked for the selected court.",
        });
      }

      if (!sportDoc) {
        return res.status(404).json({ error: "Sport document not found" });
      }

      const username = bookingData.username;
      const hasExistingBooking =
        sportData.scheduled.some((b) => b.username === username) ||
        sportData.active.some((b) => b.username === username);

      if (hasExistingBooking) {
        return res.status(409).json({
          error: "User already has a scheduled or active booking in this sport",
        });
      }

      const update = {
        $push: {
          [`${sport}.${section}`]: bookingData,
        },
      };

      const options = { upsert: false };

      const result = await db
        .collection("logs")
        .updateOne(filter, update, options);

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Booking added successfully" });
      } else {
        res.status(500).json({ error: "Booking operation failed" });
      }
    } catch (error) {
      console.error("Booking API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const { sport, court } = req.query;

      if (!sport || !court) {
        return res.status(400).json({ error: "Missing sport or court" });
      }

      let id;
      if (sport === "Badminton") id = "691013fab236682c479e1e51";
      else if (sport === "Basketball") id = "691015adb236682c479e1e55";
      else if (sport === "TableTennis") id = "691015fab236682c479e1e56";
      else return res.status(400).json({ error: "Invalid sport" });

      const filter = { _id: new ObjectId(id) };
      const sportDoc = await db.collection("logs").findOne(filter);

      if (!sportDoc)
        return res.status(404).json({ error: "Sport document not found" });

      const sportData = sportDoc[sport] || {
        scheduled: [],
        active: [],
        completed: [],
      };

      const normalizeTimeSlot = (timeSlot) => timeSlot.replace(/\s/g, "");

      const convertDateToISO = (dateStr) => {
        if (!dateStr.includes("/")) return dateStr;
        const [month, day, year] = dateStr.split("/");
        return `${year.padStart(4, "0")}-${month.padStart(
          2,
          "0"
        )}-${day.padStart(2, "0")}`;
      };

      const normalizedScheduled = sportData.scheduled
        .map((b) => ({
          ...b,
          timeSlot: b.timeSlot.replace(/\s/g, ""),
          bookingDate: convertDateToISO(b.bookingDate),
        }))
        .filter((b) => b.court === court);

      const normalizedActive = sportData.active
        .map((b) => ({
          ...b,
          timeSlot: b.timeSlot.replace(/\s/g, ""),
          bookingDate: convertDateToISO(b.bookingDate),
        }))
        .filter((b) => b.court === court);

      const bookingsForCourt = [...normalizedScheduled, ...normalizedActive];
      console.log("GET /api/bookings called with:", req.query);
      console.log("Sport document data:", sportDoc[sport]);
      console.log("Scheduled bookings:", sportData.scheduled);
      console.log("Active bookings:", sportData.active);
      console.log(`Filtering bookings for court: ${court}`);
      console.log("Sport:", sport, "Court:", court);
      console.log("Normalized scheduled:", normalizedScheduled);
      console.log("Normalized active:", normalizedActive);

      return res.json({ bookings: bookingsForCourt });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user-bookings", async (req, res) => {
    try {
      const username = req.query.username;
      if (!username) {
        return res
          .status(400)
          .json({ error: "Missing username query parameter" });
      }

      const sportsDocs = await db.collection("logs").find({}).toArray();

      const toISODate = (usDateStr) => {
        if (!usDateStr.includes("/")) return usDateStr;
        const [month, day, year] = usDateStr.split("/");
        return `${year.padStart(4, "0")}-${month.padStart(
          2,
          "0"
        )}-${day.padStart(2, "0")}`;
      };

      const normalizeBooking = (b) => ({
        ...b,
        timeSlot: b.timeSlot.replace(/\s/g, ""),
        bookingDate: toISODate(b.bookingDate),
        bookingMadeDate: toISODate(b.bookingMadeDate),
      });

      const userBookings = [];

      for (const sportDoc of sportsDocs) {
        const sportName = Object.keys(sportDoc).find((key) => key !== "_id");
        if (!sportName) continue;

        const sportData = sportDoc[sportName];
        if (!sportData) continue;

        ["scheduled", "active", "completed"].forEach((status) => {
          const list = sportData[status] || [];
          list.forEach((booking) => {
            if (booking.username === username) {
              userBookings.push({
                status,
                ...normalizeBooking(booking),
                sport: sportName,
              });
            }
          });
        });
      }

      res.json({ bookings: userBookings });
    } catch (error) {
      console.error("Error in /api/user-bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

startServer();
