import rateLimit from "express-rate-limit";

// general rate limiter for auth routes
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
})


// stricter rate limiter for login/register (prevent brute force)
export const strictAuthRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: "Too many authentication attempts, please try again after 15 minutes,",
    standardHeaders: true,
    legacyHeaders: false,
})