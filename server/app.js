require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/connect");
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth20").Strategy;
const userdb = require("./modals/userschema");
const vendordb = require("./modals/vendordetails");
const clientid =
  "518813606404-eb17r1hgans4sbdg0pm5mka3obm5oobb.apps.googleusercontent.com";
const clientsecret = "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";

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

// setup session
app.use(
  session({
    secret: "hdfhdfhsrjsgrfjf",
    resave: false,
    saveUninitialized: true,
  })
);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = new userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google ouath login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});
// New route to handle form submission and store data in MongoDB

app.post("/dashboard", async (req, res) => {
  const vendorData = req.body;

  try {
    // Create a new vendor document
    const newVendor = new vendordb(vendorData);

    // Save the document to the database
    const savedVendor = await newVendor.save();

    console.log("Vendor details saved:", savedVendor);

    // Respond to the client with a success message
    res.status(200).json({ message: "Vendor details saved successfully" });
  } catch (error) {
    console.error("Error saving vendor details:", error.message);

    // Respond to the client with an error message
    res.status(500).json({ error: "Internal server error" });
  }
});
//fetch vendor details from db

app.get("/vendors", async (req, res) => {
  try {
    const vendors = await vendordb.find({}, { _id: 0, __v: 0 });
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`server start at port no ${PORT}`);
});
