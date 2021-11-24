const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const md5 = require("md5");

async function update(req, res) {
  const { id } = req.params;
  const { customStyle } = req.body;
  console.log(id);
  console.log(customStyle);
  return;
  try {
    const updatedUser = await findByIdAndUpdate({});
  } catch (err) {
    res.sendStatus(400);
  }
}

async function create(req, res) {
  const user = new User(req.body);
  user.password = md5(user.password);
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).json({ message: "One of the parameters is incorrect" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(403)
      .json({ message: "One or more of the parameters are missing" });
    return;
  }
  const userExist = await User.findOne({
    username,
    password: md5(password),
  });
  if (!userExist) {
    res.status(403).json({ message: "One of the parameters is incorrect" });
    return;
  }
  const token = jwt.sign({ id: userExist._id }, "top-secret");

  res.json({ token });
}

async function isAvailable(req, res) {
  try {
    const found = await User.findOne({ username: req.body.username });
    res.send(!found);
  } catch (e) {
    console.log(e);
  }
}

async function getUser(req, res) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      res.sendStatus(404);
    } else {
      res.send(user);
    }
  } catch (err) {
    res.sendStatus(500);
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    res.send(user);
  } catch (err) {
    res.sendStatus(500);
  }
}

async function search(req, res) {
  try {
    const { q } = req.params;
    const foundUsers = await User.find({
      username: new RegExp(q, "ig"),
    });

    res.json(foundUsers);
  } catch (e) {
    res.sendStatus(500);
  }
}

async function follow(req, res) {
  const { username } = req.params;
  const myId = req.userId;
  try {
    const whoToFollow = await User.findOne({ username });
    if (!whoToFollow) {
      res.sendStatus(400);
      return;
    }
    await User.findByIdAndUpdate(myId, {
      $addToSet: { following: mongoose.Types.ObjectId(whoToFollow._id) },
    });
    await User.findByIdAndUpdate(whoToFollow._id.toString(), {
      $addToSet: { followers: mongoose.Types.ObjectId(myId) },
    });
    res.send();
  } catch (err) {
    res.sendStatus(500);
  }
}

async function unfollow(req, res) {
  const { username } = req.params;
  const myId = req.userId;
  try {
    const whoToUnfollow = await User.findOne({ username });
    if (!whoToUnfollow) {
      res.sendStatus(400);
      return;
    }
    await User.findByIdAndUpdate(myId, {
      $pull: { following: mongoose.Types.ObjectId(whoToUnfollow._id) },
    });
    await User.findByIdAndUpdate(whoToUnfollow._id.toString(), {
      $pull: { followers: mongoose.Types.ObjectId(myId) },
    });
    res.send();
  } catch (err) {
    res.sendStatus(500);
  }
}

module.exports = {
  create,
  login,
  isAvailable,
  getUser,
  me,
  search,
  follow,
  unfollow,
  update,
};
