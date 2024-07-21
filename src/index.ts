import express from "express";
import cors from "cors";
import { routesHandler } from "./routes/routesHandler";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api",routesHandler)

app.listen(3000, () => {
  console.log("listening on port 3000");
});