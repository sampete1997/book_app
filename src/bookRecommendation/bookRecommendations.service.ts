import axios from "axios";
import BooksSearch from "./booksSearch.schema";
import { Request, Response } from "express";
import Books from "../books/books.schema";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

const MAX_RETRIES = 5; // Max retry attempts

async function rankDocumentsWithHuggingFace(
  query: string,
  documents: Array<any>,
  retries = 0
) {
  try {
    const model = "sentence-transformers/all-MiniLM-L6-v2";

    const documentContexts = documents.map((doc) => {
      return `${doc.title}, ${doc.author}, ${doc.genre}, ${doc.rating}`;
    });
    console.log("documentsContext", query, documentContexts[0]);
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: {
          source_sentence: query,
          sentences: documentContexts,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );

    // Get similarity scores from the response (assuming the response contains a list of scores)
    const scores = response.data;
    const rankedDocuments = documents.map((doc, index) => ({
      ...doc,
      similarityScore: scores[index],
    }));

    rankedDocuments.sort((a, b) => b.similarityScore - a.similarityScore);

    return rankedDocuments
      .filter((ele) => ele.similarityScore > 0.42)
      .slice(0, 10); // Get first 10 records based on highest similarity
  } catch (error: any) {
    console.log("error", error.response.data);
    if (retries < MAX_RETRIES) {
      console.log(
        `Model is loading, retrying... Attempt ${retries + 1} of ${MAX_RETRIES}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      return rankDocumentsWithHuggingFace(query, documents, retries + 1); // Retry the request
    } else {
      console.error("Error with Hugging Face API:", error.message);
      throw error;
    }
  }
}

async function getBookRecommendtionByQuery(req: Request, res: Response) {
  try {
    const payload: any = req.body;
    const query = payload?.query;
    if (!query || query === " ") {
      throw new Error("please enter valid query");
    }
    const documents: any = await Books.find(
      {},
      { _id: 0, created_date: 0, updated_date: 0 }
    );

    const results = await rankDocumentsWithHuggingFace(query, documents);
    console.log("Top 10 Ranked Documents:", JSON.stringify(results, null, 2));
    const response = results.map((ele) => {
      return ele._doc;
    });
    return {
      status: 200,
      response: {
        data: response,
        total: response?.length,
        pages: Math.ceil(response?.length / 10),
      },
    };
  } catch (err: any) {
    console.error("Failed to rank documents:", err);
    throw new Error(err);
  }
}

export default { getBookRecommendtionByQuery };
