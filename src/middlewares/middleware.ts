import { RequestHandler } from "express";

export const middleware: RequestHandler = (req, res) => {
  res.send("Hello World 2!");
  console.log("Response sent");
};
