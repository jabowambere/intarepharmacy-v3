import jwt from "jsonwebtoken";

// Any authenticated user
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only middleware
export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔑 Verifying admin token:', token.substring(0, 20) + '...');
  console.log('🔑 JWT_SECRET available:', !!process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    console.log('✅ Token decoded:', decoded);

    if (decoded.role !== "admin") {
      console.log('❌ Not admin role:', decoded.role);
      return res.status(403).json({ message: "Admins only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
