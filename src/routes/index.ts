import { Application, Router } from "express";
import users from "./users";
import challenge from "./challenge";
import shinhan from "./shinhanApi";

// const apiRouter = (app: Application): void => {
//   app.use("/users", users);
// };

const apiRouter = Router();

apiRouter.use("/users", users);
apiRouter.use("/challenge", challenge);
apiRouter.use("/shinhan", shinhan);

export default apiRouter;
