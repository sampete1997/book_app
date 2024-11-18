import express, { NextFunction, Request, Response } from "express";
import ControllerHandler from "../common.functions/controllerHandler";
import bookRecommendationsValidator from "./bookRecommendations.validator";
import booksRecommendationService from "./bookRecommendations.service";


const bookRecommendationsController = new ControllerHandler(
  "/recommendation/query",
  "post",
  bookRecommendationsValidator,
  booksRecommendationService.getBookRecommendtionByQuery
);

bookRecommendationsController.exe();
const route = bookRecommendationsController.getRoute()


const bookRecommedationRoutes = [route]
export default bookRecommedationRoutes;
