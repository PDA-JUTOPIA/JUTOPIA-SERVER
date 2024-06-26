import { Application, Router } from "express";
import users from "./users";
import challenge from "./challenge";
import challengeParticipation from "./challengeParticipation";
import challengePost from "./challengePost";
// import challengePostComment from "./challengePostComment";
import shinhan from "./shinhanApi";
import columnboard from "./columnBoard";
import koreainvestment from "./koreainvestmentApi";

import currentLearning from "./userCurrentLearning";
import challengePostComment from "./challengePostComment";

import userReward from "./userReward";
import reward from "./reward";

// const apiRouter = (app: Application): void => {
//   app.use("/users", users);
// };

const apiRouter = Router();

apiRouter.use("/users", users);
apiRouter.use("/challenge", challenge);
apiRouter.use("/challenge", challengeParticipation);
apiRouter.use("/challenge-detail", challengePost);
apiRouter.use("/shinhan", shinhan);
apiRouter.use("/challenge/comment", challengePostComment);

apiRouter.use("/columnboard", columnboard);
apiRouter.use("/koreainvestment", koreainvestment);

apiRouter.use("/currentLearning", currentLearning);

apiRouter.use("/userReward", userReward);
apiRouter.use("/reward", reward);
export default apiRouter;
