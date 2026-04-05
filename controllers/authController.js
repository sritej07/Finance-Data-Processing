const { loginUser, registerUser } = require("../services/authService");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const { user, token } = await registerUser({
      name,
      email,
      password,
      role,
      status
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    if (error.message === "User already exists.") {
      res.status(409);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    if (
      error.message === "Invalid email or password." ||
      error.message === "User account is inactive."
    ) {
      res.status(401);
    }
    next(error);
  }
};

module.exports = {
  register,
  login
};
