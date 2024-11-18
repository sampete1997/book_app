import { body } from "express-validator";

const payload = {
  query: "query",
};

const bookRecommendationsValidator = [
  // Validate and sanitize the title
  body(payload.query)
    .notEmpty()
    .isString()
    .withMessage(`${payload.query} must be string`)
]

export default bookRecommendationsValidator;
