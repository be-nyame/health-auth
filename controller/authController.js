const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidator, loginValidator } = require("../utils/validation");

const register = async (req, res) => {
  const result = await registerValidator.validateAsync(req.body);
  const { firstName, lastName, email, password } = result;
  const alreadyExists = await User.findOne({ email });

  if (alreadyExists) {
    res
      .status(400)
      .json({ message: "Email already exist." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ user });
};

const login = async (req, res) => {
  const result = await loginValidator.validateAsync(req.body);
  const { email, password } = result;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: "Invalid Credentials" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: "Invalid Credentials" });
    return;
  }

  // Generate token to validate and authorize logged in user
  const token = jwt.sign(
                          { id: user._id },
                          "123456789", 
                          { expiresIn: "1h" }
                        );
  // Store token as cookie
  res.cookie("jwt", token)

  res.status(200).json({ token: token, userId: user._id });
};

const logout = async (req, res) => {
  // Clear token cookie on logout
  let token = req.headers["cookie"] || "";
  token = token.split("=")[1];

  if (token) {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Success" });
  } else {
    res.status(440).json({ message: "Login timeout" });
  }
};

const verifyToken = (req, res, next) => {
  let token = req.headers["cookie"] || "";
  token = token.split("=")[1];

  if (token) {
    const decodedToken = jwt.verify(token, "123456789");
    req.user = decodedToken.id;
    next();

  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};


// Fetch user to test verification / authorization
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  register,
  login,
  logout,
  verifyToken,
  getUser
};