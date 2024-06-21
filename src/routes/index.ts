import { Application, Router } from "express";
import users from "./users";
import challenge from "./challenge";
import shinhan from "./shinhanApi";
import columnboard from "./columnBoard";
import koreainvestment from "./koreainvestmentApi";

// const apiRouter = (app: Application): void => {
//   app.use("/users", users);
// };

const apiRouter = Router();

apiRouter.use("/users", users);
apiRouter.use("/challenge", challenge);
apiRouter.use("/shinhan", shinhan);
apiRouter.use("/columnboard", columnboard);
apiRouter.use("/koreainvestment", koreainvestment);

export default apiRouter;
