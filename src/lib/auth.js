import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "s4ds_mitaoe_jwt_super_secure_secret_2026_key";

export function signToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function hashPassword(plainPassword) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainPassword, salt);
}

export function comparePassword(plainPassword, hash) {
  try {
    return bcrypt.compareSync(plainPassword, hash);
  } catch {
    return false;
  }
}

export function getAuthTokenFromRequest(request) {
  // Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  // Check cookies
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, v.join("=")];
      })
    );
    if (cookies.s4ds_admin_token) {
      return cookies.s4ds_admin_token;
    }
  }

  return null;
}

export function validateAdminRequest(request) {
  const token = getAuthTokenFromRequest(request);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "admin") {
    return null;
  }
  return decoded;
}

export const verifyAuth = validateAdminRequest;
