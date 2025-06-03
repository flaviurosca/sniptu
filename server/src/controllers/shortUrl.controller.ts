import { Request, Response, NextFunction } from "express";
import UrlModel from "../model/shortUrl.model";
import mongoose from "mongoose";
import normalizeUrl from "normalize-url";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type HttpError = Error & { status?: number };

/**
 * @desc Create a short url
 * @route POST /api/urls
 */
export const createUrl: Controller = async (req, res, next) => {
  let { fullUrl } = req.body;

  if (!fullUrl || typeof fullUrl !== "string") {
    const error: HttpError = new Error("Invalid URL");
    error.status = 400;
    return next(error);
  }

  try {
    fullUrl = normalizeUrl(fullUrl, {
      stripWWW: false,
      removeTrailingSlash: true,
      forceHttps: false,
    })
      .trim()
      .toLowerCase();

    new URL(fullUrl);
  } catch {
    const error: HttpError = new Error("Invalid URL format");
    error.status = 400;
    return next(error);
  }

  try {
    const urlFound = await UrlModel.findOne({ fullUrl });

    if (urlFound) {
      const error: HttpError = new Error("URL already exists");
      error.status = 409;
      return next(error);
    }

    const shortUrl = await UrlModel.create({ fullUrl });
    const response: ApiResponse<typeof shortUrl> = {
      success: true,
      data: shortUrl,
      message: "Short URL created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all urls
 * @route GET /api/urls
 */
export const getAllUrls: Controller = async (req, res, next) => {
  try {
    const shortUrls = await UrlModel.find({}).sort({ createdAt: -1 });

    const response: ApiResponse<typeof shortUrls> = {
      success: true,
      data: shortUrls,
      message: shortUrls.length
        ? "Short URLs retrieved successfully"
        : "No short URLs found",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Redirect to full URL using shortUrl
 * @route GET /api/urls/:shortUrl
 */
export const redirectUrl: Controller = async (req, res, next) => {
  try {
    const shortUrl = await UrlModel.findOne({ shortUrl: req.params.shortUrl });

    if (!shortUrl) {
      const error: HttpError = new Error("Full URL not found");
      error.status = 404;
      return next(error);
    }

    shortUrl.clicks++;
    await shortUrl.save();

    res.redirect(shortUrl.fullUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a url by id
 * @route DELETE /api/urls/:id
 */
export const deleteUrl: Controller = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error: HttpError = new Error("Invalid URL Id");
    error.status = 400;
    return next(error);
  }

  try {
    const shortUrl = await UrlModel.findByIdAndDelete(id);

    if (!shortUrl) {
      const error: HttpError = new Error("URL not found");
      error.status = 404;
      return next(error);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: "URL deleted successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
