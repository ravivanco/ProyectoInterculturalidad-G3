CREATE TABLE IF NOT EXISTS plan_weeks (
    id SERIAL PRIMARY KEY,
    nutrition_plan_id TEXT NOT NULL,
    week_number INTEGER NOT NULL DEFAULT 1,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nutrition_plan_id, week_number)
);

CREATE TABLE IF NOT EXISTS day_menus (
    id SERIAL PRIMARY KEY,
    week_id INTEGER NOT NULL,
    day VARCHAR(20) NOT NULL,
    meal_time VARCHAR(30) NOT NULL,
    dish_id INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_week
        FOREIGN KEY (week_id)
        REFERENCES plan_weeks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_menu_dish
        FOREIGN KEY (dish_id)
        REFERENCES dishes(id)
        ON DELETE SET NULL,

    UNIQUE (week_id, day, meal_time)
);