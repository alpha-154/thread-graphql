import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import createApolloGraphQLServer from "./graphql";
import { expressMiddleware } from "@apollo/server/express4";
import UserService from "./services/user";

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
  app.use(
    "/graphql",
    //@ts-ignore
    expressMiddleware(await createApolloGraphQLServer(), {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port 🔩 ${PORT}`);
  });
}

init();
