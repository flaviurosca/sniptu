import { Request, Response, NextFunction } from "express";

type ErrorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

const errorHandler: ErrorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Server Error";

  res.status(status).json({
    success: false,
    message,
  });
};

export default errorHandler;
