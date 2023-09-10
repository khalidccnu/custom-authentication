require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const multer = require("multer");
const imageKit = require("imagekit");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 5000;
const uploadMulter = multer();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const imagekit = new imageKit({
  publicKey: process.env.IK_PL_KEY,
  privateKey: process.env.IK_PV_KEY,
  urlEndpoint: `https://ik.imagekit.io/` + process.env.IK_ID,
});

const uploadToIK = async (req, res) => {
  let fieldName = req.file.fieldname.replace("Img", "");

  switch (fieldName) {
    case "user":
      fieldName = "users";
      break;
    default:
      fieldName = "";
  }

  imagekit
    .upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `custom-authentication/${fieldName}`,
    })
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
};

const createJWT = (id) => {
  return jwt.sign({ _id: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return { err };
    return { decoded };
  });
};

const checkJWT = (req, res, next) => {
  const authorization = req.cookies?.token;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }

  const result = verifyJWT(authorization);

  if (result.err) {
    return res.status(403).json({ message: "Forbidden access!" });
  }

  req.decoded = result.decoded;
  next();
};

const mdbClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async () => {
  try {
    const users = mdbClient.db("custom-authentication").collection("users");

    app.post("/users/upload", uploadMulter.single("userImg"), uploadToIK);

    app.post("/signin", async (req, res) => {
      const { phone, password } = req.body;

      const user = await users.findOne({ phone: `+880${phone}` });

      if (!user) {
        return res.status(401).json({ message: "User not found!" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password!" });
      }

      const token = createJWT(user._id);

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
          sameSite: "lax",
        })
        .json({ message: "Sign in successful!" });
    });

    app.post("/signup", async (req, res) => {
      const { phone, password } = req.body;

      const existingUser = await users.findOne({ phone: `+880${phone}` });

      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User with this phone already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        ...req.body,
        phone: `+880${phone}`,
        password: hashedPassword,
      };

      const result = await users.insertOne(user);

      const token = createJWT(result.insertedId);

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
          sameSite: "lax",
        })
        .json({ message: "User registered successfully!" });
    });

    app.get("/loggedIn", async (req, res) => {
      const token = req.cookies?.token;

      if (!token) {
        return res.json({});
      }

      const result = verifyJWT(token);

      if (result.decoded) {
        return res.json({ _id: result.decoded._id });
      }

      return res.json({});
    });

    app.get("/users/:id", checkJWT, async (req, res) => {
      if (req.decoded._id !== req.params.id) {
        return res.status(403).json({ message: "Forbidden access!" });
      }

      const options = {
        projection: { name: 1, phone: 1, email: 1, userImg: 1 },
      };
      const query = { _id: new ObjectId(req.params.id) };
      const result = await users.findOne(query, options);

      res.json(result);
    });

    mdbClient
      .db("admin")
      .command({ ping: 1 })
      .then((_) => console.log("Successfully connected to MongoDB!"));
  } catch (err) {
    console.log("Did not connect to MongoDB! " + err.message);
  } finally {
    // await mdbClient.close();
  }
})();

app.get("/signout", (req, res) => {
  res.clearCookie("token").json({ message: "Sign out successfully!" });
});

app.get("/", (req, res) => {
  res.send("Custom authentication is running...");
});

app.listen(port, () => {
  console.log(`Custom authentication API is running on port: ${port}`);
});
