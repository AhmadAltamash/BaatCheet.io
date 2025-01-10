import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
      console.log("No token found in cookies");
      return res.status(401).send("You are not authenticated");
  }
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
          console.log("Invalid token:", err.message);
          return res.status(403).send("Token is not valid");
      }
      console.log("Token is valid, user ID:", payload.userId);
      req.userId = payload.userId;
      next();
  });
};

  