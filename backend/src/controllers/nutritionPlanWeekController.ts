import { Request, Response } from "express";
import pool from "../config/pgPool";

const DEFAULT_DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes"];

const DEFAULT_MEAL_TIMES = [
  "desayuno",
  "media_manana",
  "almuerzo",
  "media_tarde",
  "cena",
];

const normalizeText = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getMenusByWeekId = async (queryable: any, weekId: number) => {
  const result = await queryable.query(
    `
    SELECT 
      dm.id,
      dm.week_id,
      dm.day,
      dm.meal_time,
      dm.dish_id,
      dm.notes,
      dm.created_at,
      dm.updated_at,
      CASE 
        WHEN d.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', d.id,
          'nombre', d.nombre,
          'tipo_comida', d.tipo_comida,
          'calorias_total', d.calorias_total,
          'imagen_url', d.imagen_url,
          'preparacion', d.preparacion
        )
      END AS dish
    FROM day_menus dm
    LEFT JOIN dishes d ON d.id = dm.dish_id
    WHERE dm.week_id = $1
    ORDER BY 
      CASE dm.day
        WHEN 'lunes' THEN 1
        WHEN 'martes' THEN 2
        WHEN 'miercoles' THEN 3
        WHEN 'jueves' THEN 4
        WHEN 'viernes' THEN 5
        WHEN 'sabado' THEN 6
        WHEN 'domingo' THEN 7
        ELSE 8
      END,
      CASE dm.meal_time
        WHEN 'desayuno' THEN 1
        WHEN 'media_manana' THEN 2
        WHEN 'almuerzo' THEN 3
        WHEN 'media_tarde' THEN 4
        WHEN 'cena' THEN 5
        ELSE 6
      END
    `,
    [weekId]
  );

  return result.rows;
};

export const createPlanWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = await pool.connect();

  try {
    const { planId } = req.params;
    const { week_number, start_date, end_date, days, meal_times } = req.body;

    const weekNumber = Number(week_number || 1);

    const selectedDays =
      Array.isArray(days) && days.length > 0
        ? days.map((day: string) => normalizeText(day))
        : DEFAULT_DAYS;

    const selectedMealTimes =
      Array.isArray(meal_times) && meal_times.length > 0
        ? meal_times.map((meal: string) => normalizeText(meal))
        : DEFAULT_MEAL_TIMES;

    if (!planId) {
      res.status(400).json({
        message: "El planId es obligatorio",
      });
      return;
    }

    await client.query("BEGIN");

    const weekResult = await client.query(
      `
      INSERT INTO plan_weeks
      (nutrition_plan_id, week_number, start_date, end_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (nutrition_plan_id, week_number)
      DO UPDATE SET
        start_date = COALESCE(EXCLUDED.start_date, plan_weeks.start_date),
        end_date = COALESCE(EXCLUDED.end_date, plan_weeks.end_date),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [planId, weekNumber, start_date || null, end_date || null]
    );

    const week = weekResult.rows[0];

    for (const day of selectedDays) {
      for (const mealTime of selectedMealTimes) {
        await client.query(
          `
          INSERT INTO day_menus
          (week_id, day, meal_time)
          VALUES ($1, $2, $3)
          ON CONFLICT (week_id, day, meal_time)
          DO NOTHING
          `,
          [week.id, day, mealTime]
        );
      }
    }

    const menus = await getMenusByWeekId(client, week.id);

    await client.query("COMMIT");

    res.status(201).json({
      message: "Estructura semanal creada correctamente",
      week,
      menus,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al crear semana:", error);

    res.status(500).json({
      message: "Error al crear la estructura semanal",
    });
  } finally {
    client.release();
  }
};

export const getPlanWeeks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { planId } = req.params;

    const weeksResult = await pool.query(
      `
      SELECT *
      FROM plan_weeks
      WHERE nutrition_plan_id = $1
      ORDER BY week_number ASC
      `,
      [planId]
    );

    const weeks = [];

    for (const week of weeksResult.rows) {
      const menus = await getMenusByWeekId(pool, week.id);

      weeks.push({
        ...week,
        menus,
      });
    }

    res.json({
      total: weeks.length,
      weeks,
    });
  } catch (error) {
    console.error("Error al obtener semanas:", error);

    res.status(500).json({
      message: "Error al obtener las semanas del plan nutricional",
    });
  }
};

export const assignMenuToDay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { weekId, day } = req.params;
    const { meal_time, dish_id, notes } = req.body;

    const normalizedDay = normalizeText(day);
    const normalizedMealTime = normalizeText(meal_time || "");

    if (!DEFAULT_DAYS.includes(normalizedDay)) {
      res.status(400).json({
        message:
          "Día inválido. Usa lunes, martes, miercoles, jueves o viernes.",
      });
      return;
    }

    if (!DEFAULT_MEAL_TIMES.includes(normalizedMealTime)) {
      res.status(400).json({
        message:
          "Tiempo de comida inválido. Usa desayuno, media_manana, almuerzo, media_tarde o cena.",
      });
      return;
    }

    if (!dish_id) {
      res.status(400).json({
        message: "El dish_id es obligatorio",
      });
      return;
    }

    const weekResult = await pool.query(
      `
      SELECT *
      FROM plan_weeks
      WHERE id = $1
      `,
      [weekId]
    );

    if (weekResult.rows.length === 0) {
      res.status(404).json({
        message: "Semana no encontrada",
      });
      return;
    }

    const dishResult = await pool.query(
      `
      SELECT *
      FROM dishes
      WHERE id = $1
      `,
      [dish_id]
    );

    if (dishResult.rows.length === 0) {
      res.status(404).json({
        message: "Plato no encontrado",
      });
      return;
    }

    const menuResult = await pool.query(
      `
      INSERT INTO day_menus
      (week_id, day, meal_time, dish_id, notes)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (week_id, day, meal_time)
      DO UPDATE SET
        dish_id = EXCLUDED.dish_id,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
      `,
      [weekId, normalizedDay, normalizedMealTime, dish_id, notes || null]
    );

    res.status(201).json({
      message: "Menú asignado correctamente",
      menu: menuResult.rows[0],
      dish: dishResult.rows[0],
    });
  } catch (error) {
    console.error("Error al asignar menú:", error);

    res.status(500).json({
      message: "Error al asignar el menú al día",
    });
  }
};

export const getDayMenus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { weekId, day } = req.params;
    const normalizedDay = normalizeText(day);

    const result = await pool.query(
      `
      SELECT 
        dm.id,
        dm.week_id,
        dm.day,
        dm.meal_time,
        dm.dish_id,
        dm.notes,
        dm.created_at,
        dm.updated_at,
        CASE 
          WHEN d.id IS NULL THEN NULL
          ELSE json_build_object(
            'id', d.id,
            'nombre', d.nombre,
            'tipo_comida', d.tipo_comida,
            'calorias_total', d.calorias_total,
            'imagen_url', d.imagen_url,
            'preparacion', d.preparacion
          )
        END AS dish
      FROM day_menus dm
      LEFT JOIN dishes d ON d.id = dm.dish_id
      WHERE dm.week_id = $1
      AND dm.day = $2
      ORDER BY 
        CASE dm.meal_time
          WHEN 'desayuno' THEN 1
          WHEN 'media_manana' THEN 2
          WHEN 'almuerzo' THEN 3
          WHEN 'media_tarde' THEN 4
          WHEN 'cena' THEN 5
          ELSE 6
        END
      `,
      [weekId, normalizedDay]
    );

    res.json({
      week_id: Number(weekId),
      day: normalizedDay,
      total: result.rows.length,
      menus: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener menús:", error);

    res.status(500).json({
      message: "Error al obtener los menús del día",
    });
  }
};