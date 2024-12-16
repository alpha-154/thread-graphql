import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import createApolloGraphQLServer from "./graphql";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();

  const PORT = Number(process.env.PORT) || 8080;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  const gqlServer = await createApolloGraphQLServer();

  //@ts-ignore
  // Attach Apollo Server middleware to the Express app at the /graphql endpoint
  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on port 🔩 ${PORT}`);
  });
}

init();
