const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readData } = require("../utils/jsonDB");
// REGISTER USER---------
// exports.register = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: " Email and Password Are Required!" });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(409).json({ message: "User Already Exist" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       email,
//       password: hashedPassword,
//     });

//     await user.save();

//     const token = jwt.sign(
//       {
//         email,
//         id: user._id,
//       },
//       process.env.JWT_KEY,
//       { expiresIn: "7d" },
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(201).json({ message: "User Created Successfully", user });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Created user is failed!", error: error.message });
//   }
// };



// LOGIN USER------------------

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password Are Required!" });
    }


    const database = readData("database");
    const users = database.users || [];
    const user = users.find(
      (user) => user.email?.trim().toLowerCase() === email?.trim().toLowerCase(),
    );


    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }

    const isMatchedPassword =
      user.password === password ||
      (await bcrypt.compare(password, user.password).catch(() => false));

    if (!isMatchedPassword) {
      return res.status(401).json({ message: "incorrect password!" });
    }

    const secretKey = process.env.JWT_KEY || "broadcast_cg_default_secret_key";
    const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "User Login Successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login user is failed!", error: error.message });
  }
};

// USER LOGOUT--------------

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "User Logout Successfully" });
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const database = readData("database");
    const users = database.users || [];
    const user = users.find((u) => String(u.id) === String(req.user.id));
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({
      message: "Current user fetched successfully.",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch current user.", error: error.message });
  }
};
