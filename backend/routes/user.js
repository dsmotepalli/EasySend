const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
const upDateBody = zod.object({
  password: zod.string().optional(),
  lastName: zod.string().optional(),
  firstName: zod.string().optional(),
});

router.get("/currentuser", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  return res.status(200).json(user);
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  console.log(success);
  if (!success) {
    return res.status(400).json({
      message: "Please check the inputs ",
    });
  }

  const exsitingUser = await User.findOne({
    username: req.body.username,
  });

  if (exsitingUser) {
    return res.status(411).json({
      message: "User Already Exists",
    });
  }
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId }, JWT_SECRET);
  return res.status(200).json({
    message: `User Created success fully with Id ${user._id}`,
    token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  console.log(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Please check the inputs given",
    });
  }

  const userDetails = await User.findOne({ username: req.body.username });
  if (!userDetails) {
    return res.status(411).json({
      message: "User Doesn't exist please signup first",
    });
  }
  if (
    userDetails.username === req.body.username &&
    userDetails.password === req.body.password
  ) {
    const token = jwt.sign({ userId: userDetails._id }, JWT_SECRET);
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(411).json({
      message: "Username and Password doesn't match",
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = upDateBody.safeParse(req.body);
  console.log(success);
  if (!success) {
    return res.status(411).json({
      message: "Please check the inputs again",
    });
  }
  console.log(req.userId);
  try {
    const result = await User.updateOne({ _id: req.userId }, req.body);
    console.log(result);
    if (result.modifiedCount) {
      return res.json({
        message: "Updated successfully",
      });
    }
    return res.status(411).json({
      message: "Please chekc the inputs given",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: new RegExp(filter, "i"),
        },
      },
      {
        lastName: {
          $regex: new RegExp(filter, "i"),
        },
      },
    ],
  });
  if (!users) {
    return res.json({
      message: "No users with that name",
    });
  }
  
  const newArray = users.filter((user) => user._id.toString() !== req.userId);
  

  return res.json({
    users: newArray.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
