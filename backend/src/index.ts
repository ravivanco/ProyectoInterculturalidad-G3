import app from "./app";
import { connectDB } from "./config/database";
import { startDailyAlertsJob } from "./jobs/dailyAlerts.job";

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  await connectDB();

  startDailyAlertsJob();

  app.listen(PORT, () => {
    console.log("=================================");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(
      `Environment: ${process.env.NODE_ENV || "development"}`
    );
    console.log("=================================");
  });
};

startServer();