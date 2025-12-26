import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";

export const generateToken = (userId: string, email: string, role: string) => {
    return jwt.sign(
        {userId, email, role}, // payload data to encode
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    )
}