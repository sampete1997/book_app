// POST endpoint to add product data
import express, { Request, Response } from "express";
import bookRoutes from "./books/books.controller";
import bookRecommedationRoutes from "./bookRecommendation/bookRecommendations.controller";
const mainRoute = express.Router();
const controllers = [...bookRoutes,...bookRecommedationRoutes];
controllers.forEach((controller) => {
  mainRoute.use(controller);
});

export default mainRoute;
