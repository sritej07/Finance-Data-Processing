const { loginUser, registerUser } = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    token,
    user
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user
  });
});

module.exports = {
  register,
  login
};
