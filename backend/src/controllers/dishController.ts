import { Request, Response } from "express";
import pool from "../config/pgPool";

export const createDish = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = await pool.connect();

  try {
    const {
      nombre,
      tipo_comida,
      calorias_total,
      imagen_url,
      preparacion,
      ingredientes,
    } = req.body;

    if (!nombre || !tipo_comida) {
      res.status(400).json({
        message: "El nombre y el tipo de comida son obligatorios",
      });
      return;
    }

    await client.query("BEGIN");

    const dishResult = await client.query(
      `
      INSERT INTO dishes
      (nombre, tipo_comida, calorias_total, imagen_url, preparacion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        nombre,
        tipo_comida,
        calorias_total || 0,
        imagen_url || null,
        preparacion || null,
      ]
    );

    const dish = dishResult.rows[0];

    if (Array.isArray(ingredientes)) {
      for (const ingrediente of ingredientes) {
        await client.query(
          `
          INSERT INTO dish_ingredients
          (dish_id, food_id, cantidad, unidad)
          VALUES ($1, $2, $3, $4)
          `,
          [
            dish.id,
            ingrediente.food_id,
            ingrediente.cantidad,
            ingrediente.unidad,
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Plato creado correctamente",
      dish,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al crear plato:", error);

    res.status(500).json({
      message: "Error al crear el plato",
    });
  } finally {
    client.release();
  }
};

export const getDishes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tipo_comida, nombre } = req.query;

    let query = `
      SELECT *
      FROM dishes
      WHERE 1 = 1
    `;

    const values: unknown[] = [];

    if (tipo_comida) {
      values.push(tipo_comida);
      query += ` AND tipo_comida = $${values.length}`;
    }

    if (nombre) {
      values.push(`%${nombre}%`);
      query += ` AND nombre ILIKE $${values.length}`;
    }

    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, values);

    res.json({
      total: result.rows.length,
      dishes: result.rows,
    });
  } catch (error) {
    console.error("Error al obtener platos:", error);

    res.status(500).json({
      message: "Error al obtener los platos",
    });
  }
};

export const getDishById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const dishResult = await pool.query(
      `
      SELECT *
      FROM dishes
      WHERE id = $1
      `,
      [id]
    );

    if (dishResult.rows.length === 0) {
      res.status(404).json({
        message: "Plato no encontrado",
      });
      return;
    }

    const ingredientsResult = await pool.query(
      `
      SELECT 
        di.id,
        di.dish_id,
        di.food_id,
        di.cantidad,
        di.unidad,
        to_jsonb(f) AS food
      FROM dish_ingredients di
      LEFT JOIN foods f ON f.id = di.food_id
      WHERE di.dish_id = $1
      ORDER BY di.id ASC
      `,
      [id]
    );

    res.json({
      dish: dishResult.rows[0],
      ingredientes: ingredientsResult.rows,
    });
  } catch (error) {
    console.error("Error al obtener plato:", error);

    res.status(500).json({
      message: "Error al obtener el plato",
    });
  }
};

export const updateDish = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      nombre,
      tipo_comida,
      calorias_total,
      imagen_url,
      preparacion,
      ingredientes,
    } = req.body;

    await client.query("BEGIN");

    const dishResult = await client.query(
      `
      UPDATE dishes
      SET 
        nombre = COALESCE($1, nombre),
        tipo_comida = COALESCE($2, tipo_comida),
        calorias_total = COALESCE($3, calorias_total),
        imagen_url = COALESCE($4, imagen_url),
        preparacion = COALESCE($5, preparacion),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [nombre, tipo_comida, calorias_total, imagen_url, preparacion, id]
    );

    if (dishResult.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        message: "Plato no encontrado",
      });
      return;
    }

    if (Array.isArray(ingredientes)) {
      await client.query(
        `
        DELETE FROM dish_ingredients
        WHERE dish_id = $1
        `,
        [id]
      );

      for (const ingrediente of ingredientes) {
        await client.query(
          `
          INSERT INTO dish_ingredients
          (dish_id, food_id, cantidad, unidad)
          VALUES ($1, $2, $3, $4)
          `,
          [
            id,
            ingrediente.food_id,
            ingrediente.cantidad,
            ingrediente.unidad,
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      message: "Plato actualizado correctamente",
      dish: dishResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error al actualizar plato:", error);

    res.status(500).json({
      message: "Error al actualizar el plato",
    });
  } finally {
    client.release();
  }
};