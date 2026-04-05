const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const registerUser = async ({ name, email, password, role, status }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists.", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    status
  });

  return {
    user: sanitizeUser(user),
    token: generateToken(user)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status !== "active") {
    throw new AppError("User account is inactive.", 401);
  }

  const isPasswordMatched = await user.matchPassword(password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password.", 401);
  }

  return {
    user: sanitizeUser(user),
    token: generateToken(user)
  };
};

module.exports = {
  generateToken,
  sanitizeUser,
  registerUser,
  loginUser
};
