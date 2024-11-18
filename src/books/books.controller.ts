import express, { NextFunction, Request, Response } from "express";
import bookValidator from "./books.validator";
import booksService from "./books.service";
import ControllerHandler from "../common.functions/controllerHandler";


const getBooksController = new ControllerHandler(
  "/books/getbooksList",
  "post",
  bookValidator,
  booksService.getbooksList
);

getBooksController.exe();
const route = getBooksController.getRoute()


const bookRoutes = [route]
export default bookRoutes;
