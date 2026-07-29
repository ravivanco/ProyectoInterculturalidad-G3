import cron from "node-cron";

import { evaluateAutomaticAlerts } from "../services/alertEvaluation.service";

export const startDailyAlertsJob = (): void => {
  cron.schedule(
    "0 1 * * *",
    async () => {
      try {
        console.log(
          "🔔 Iniciando evaluación diaria de alertas..."
        );

        const result =
          await evaluateAutomaticAlerts();

        console.log(
          "✅ Evaluación diaria finalizada:",
          result
        );
      } catch (error) {
        console.error(
          "❌ Error en el cron de alertas:",
          error
        );
      }
    },
    {
      timezone:
        process.env.CRON_TIMEZONE ??
        "America/Guayaquil",
    }
  );

  console.log(
    "⏰ Cron diario de alertas registrado"
  );
};