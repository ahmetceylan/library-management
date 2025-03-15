// index.ts
import { middleware } from "#middlewares/middleware.js";
import express from "express";

const app = express();
const port = process.env.PORT ?? "9001";

app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
