import { Application, Router } from "express";
import users from "./users";
import challenge from "./challenge";

// const apiRouter = (app: Application): void => {
//   app.use("/users", users);
// };

const apiRouter = Router();

apiRouter.use("/users", users);
apiRouter.use("/challenge", challenge);

export default apiRouter;
