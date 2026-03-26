import type { NextFunction, Request, Response } from "express";

import Auth from "../lib/auth";

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Missing X-User-ID header",
    });
    return;
  }

  // Optionally validate the userId format or check against a database
  if (userId.trim() === "" || !Auth.findUser(userId)) {
    res.status(401).json({
      success: false,
      message: "Invalid X-User-ID header",
    });
    return;
  }

  // Attach userId to request object for use in subsequent middleware/routes
  (req as any).userId = userId;

  next();
};
