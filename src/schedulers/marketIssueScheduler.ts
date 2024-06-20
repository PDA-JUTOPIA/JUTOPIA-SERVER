import cron from "node-cron";
import { fetchAndStoreMarketIssues } from "../controllers/shinhanApiController";
import logger from "../logger";

// 매시간마다 실행되는 스케줄러 설정
cron.schedule("0 * * * *", async () => {
  logger.info("[Scheduler] triggered");
  try {
    await fetchAndStoreMarketIssues();
    console.log("[Scheduler] Fetching and storing market issues...");
    logger.info("[Scheduler] Market issues fetched and stored successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("[Scheduler] Market issues fetched and stored.");
      logger.error(
        "[Scheduler] Error fetching and storing market issues: " + error.message
      );
    } else {
      logger.error("Unknown error occurred");
    }
  }
});
