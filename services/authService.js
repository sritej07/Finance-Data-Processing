const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const registerUser = async ({ name, email, password, role, status }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    status
  });

  return {
    user,
    token: generateToken(user._id)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (user.status !== "active") {
    throw new Error("User account is inactive.");
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  return {
    user,
    token: generateToken(user._id)
  };
};

module.exports = {
  generateToken,
  registerUser,
  loginUser
};
