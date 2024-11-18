import { NextFunction, Request, Response } from "express";
import Books from "./books.schema";
import { filterChecks } from "../common.functions/filtercheck";

async function getbooksList(req: Request, res: Response) {
  try {
    const payload: iBooks = req.body;
    const {
      page = 1,
      author,
      genre,
      publishedDate,
      rating,
      title,
      sort_by = "title",
      limit = 10,
    } = payload;
    const filters: any = filterChecks({
      author,
      genre,
    });

    if (rating > 0) {
      filters["rating"] = Number(rating);
    }

    if (title) {
      filters["title"] = {
        $regex: title, // Replace with your search term
        $options: "i", // Case-insensitive search
      };
    }

    console.log("filters", filters);

    const result = await Books.aggregate([
      {
        $match: { ...filters },
      },
      {
        $sort: {
          [sort_by ? sort_by : "title"]: 1,
        },
      },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit }, // Skip documents for pagination
            { $limit: limit }, // Limit number of documents for pagination
          ],
          allData: [
            {
              $match: {},
            },
          ],
          totalCount: [
            { $count: "count" }, // Total document count
          ],
        },
      },
    ]);

    const total = result[0].totalCount[0]?.count || 0;
    const data = result[0]?.data || [];
    const allData = result[0]?.allData || [];
    const pages = Math.ceil(total / limit);
    const options: any = {
      rating: new Set(),
      genre: new Set(),
      author: new Set(),
    };

    allData?.map((ele: iBooks) => {
      options.author.add(ele.author);
      options.genre.add(ele.genre);
      options.rating.add(ele.rating);
    });

    return {
      status: 200,
      response: {
        data,
        total,
        pages,
        options: {
          author: [...options.author],
          genre: [...options.genre],
          rating: [...options.rating],
          sort_by: ["title", "author", "genre", "rating"],
        },
      },
    };
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

async function createNewBookRecord(payload: any) {
  try {
    const newBook = new Books({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      rating: 4.5,
      publishedDate: new Date("1925-04-10"),
    });

    const createdBook = await newBook.save();
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

export default { getbooksList, createNewBookRecord };
