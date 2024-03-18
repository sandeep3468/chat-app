import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Path Not Found: " + req.originalUrl);
  res.status(404);
  next(error);
};

const errorHandle = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.log(err);
  res.send({
    statusCode: statusCode,
    error: err?.message,
  });
};

export { notFound, errorHandle };
