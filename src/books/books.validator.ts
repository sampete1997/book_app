import { body } from "express-validator";

const payload = {
  title: "title",
  author: "author",
  genre: "genre",
  rating: "rating",
  publishedDate: "publishedDate",
  page: "page",
  sort_by: "sort_by",
};

const bookValidator = [
  // Validate and sanitize the title
  body(payload.title)
    .optional()
    .isString()
    .withMessage(`${payload.title} must be string`),

  // Validate and sanitize the author
  body(payload.author)
    .optional()
    .isString()
    .withMessage(`${payload.author} must be string`),

  // Validate and sanitize the genre
  body(payload.genre)
    .optional()
    .isString()
    .withMessage(`${payload.genre} must be string`),

  // Validate the rating to be a number between 1 and 5
  body(payload.rating)
    .optional()
    .isNumeric()
    .withMessage(`${payload.rating} must be number`),

  // Validate the published date to be a valid date
  body(payload.publishedDate)
    .optional()
    .isString()
    .withMessage(`${payload.publishedDate} must be string`)
    .custom((value) => {
      const date = new Date(value);
      if (date > new Date()) {
        throw new Error(`${payload.publishedDate} cannot be in the future`);
      }
      return true;
    })
    .withMessage(`${payload.publishedDate} cannot be in the future`),

  body(payload.sort_by)
    .optional()
    .isString()
    .withMessage(`${payload.sort_by} must be string`),

  body(payload.page)
    .notEmpty()
    .isNumeric()
    .withMessage(`${payload.page} must be number`)
    .isFloat({ gt: 0 }) // Checks if the value is a float and greater than 0
    .withMessage("The page must be greater than 0"),
];

export default bookValidator;
