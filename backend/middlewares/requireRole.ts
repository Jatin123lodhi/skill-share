import type { NextFunction, Request, Response } from "express";

export const requireRole = (allowedRole: string) => {
    return (req: Request, res:Response, next: NextFunction) => {
        if(!req.user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if(req.user.role === allowedRole){
            next();
        }else{
            return res.status(403).json({
                message: "Forbidden - Insufficient permissions"
            })
        }
    }
}