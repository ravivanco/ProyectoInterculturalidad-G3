CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    calorias NUMERIC(10,2) DEFAULT 0,
    unidad VARCHAR(30) DEFAULT 'g',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dishes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_comida VARCHAR(50) NOT NULL,
    calorias_total NUMERIC(10,2) DEFAULT 0,
    imagen_url TEXT,
    preparacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dish_ingredients (
    id SERIAL PRIMARY KEY,
    dish_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    cantidad NUMERIC(10,2) NOT NULL,
    unidad VARCHAR(30) NOT NULL,

    CONSTRAINT fk_dish
        FOREIGN KEY (dish_id)
        REFERENCES dishes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
);

INSERT INTO foods (nombre, tipo, calorias, unidad)
VALUES 
('Pollo', 'Proteína', 165, 'g'),
('Arroz', 'Carbohidrato', 130, 'g'),
('Lechuga', 'Vegetal', 15, 'g'),
('Tomate', 'Vegetal', 18, 'g')
ON CONFLICT DO NOTHING;