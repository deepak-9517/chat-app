const jwt = require("jsonwebtoken");
const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Unauthorized user!" });
      }
      next();
    });
  } catch (error) {
    console.log("errorn in verify jwt", error.message);
  }
};

module.exports = { verifyJwt };
