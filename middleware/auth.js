import supabase from "../supabaseClient.js";

const requireAuth = async (req, res, next) => {
  // Get token from request header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - no token provided" });
  }

  const token = authHeader.split(" ")[1]; // extract token after "Bearer "

  // Verify token with Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }

  req.user = user; // attach user to request so routes can access it
  next();
};

export default requireAuth;
