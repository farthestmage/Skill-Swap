const client = require("../service/db")

async function Get_Units_Query() {
    const query = `
            SELECT
                tf.field_id,
                tf.name AS field_name,
                tf.description AS telemetry_description,
                mu.name AS unit_name,
                mu.symbol AS unit_symbol,
                mu.description AS unit_description
            FROM telemetry_fields tf
            LEFT JOIN measurement_units mu ON tf.unit_id = mu.unit_id
            `
    try {
        const { rows } = await client.query(query);
        return rows;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

async function Get_Widgets_Query() {
    const query = `
        SELECT
            widget_id,
            widget_name,
            widget_icon,
            default_width,
            default_height,
            min_fields,
            max_fields,
            created_at
        FROM widgets
        ORDER BY widget_id;
    `;

    try {
        const { rows } = await client.query(query);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { Get_Units_Query, Get_Widgets_Query }