import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post("/bread-or-cake", (req: Request, res: Response) => {
  try {
    // Simulate input validation
    if (typeof req.body.ingredients !== "string" || !req.body.ingredients) {
      const error: ApiError = {
        statusCode: 400,
        message: "Invalid input. Please provide a string of ingredients.",
      };
      return res.status(error.statusCode).json(error);
    }

    // Simulate calling an external API and determining the result
    const result = Math.random() > 0.5 ? "It's bread" : "It's cake";

    res.status(200).send(result);
  } catch (err) {
    // General error handling
    const error: ApiError = {
      statusCode: 500,
      message: "An error occurred on the server.",
    };
    res.status(error.statusCode).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
