import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebstoken";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import { verifyAuthToken } from "../util/token";

dotenv.config({ path: "./.env" });

const isAuthenticatedUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || req.cookies.Authorization;
    // console.log("Cookies token", req.cookies.Authorization);
    const refreshToken = req.headers?.refreshToken || "";
    if (!token) {
      res.status(401);
      throw new Error("Access denied. No token provided");
    }
    const decodedData = verifyAuthToken(token);
    if (decodedData) {
      req.body.user = decodedData;
      next();
    } else {
      res.status(401);
      throw new Error("Access denied. Invalid token");
    }
  }
);

export default isAuthenticatedUser;
