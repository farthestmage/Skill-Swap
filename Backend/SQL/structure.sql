-- 🧑 Users Table: Stores user information
CREATE TABLE users (
    user_id UUID NOT NULL UNIQUE,
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 📏 Measurement Units: Predefined measurement units (e.g., Celsius, km/h)
CREATE TABLE measurement_units (
    unit_id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 🌡 Telemetry Fields: Predefined telemetry fields (e.g., temperature, humidity)
CREATE TABLE telemetry_fields (
    field_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    unit_id INT REFERENCES measurement_units(unit_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 🏗 Device Templates: Templates defining device structure
CREATE TABLE device_templates (
    template_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 🔗 Template Fields: Mapping between device templates & telemetry fields
CREATE TABLE template_fields (
    template_id BIGINT NOT NULL REFERENCES device_templates(template_id) ON DELETE CASCADE,
    field_id INT NOT NULL REFERENCES telemetry_fields(field_id) ON DELETE RESTRICT,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (template_id, field_id)
);

-- 📡 Devices: IoT devices assigned to users
CREATE TABLE devices (
    device_id SERIAL PRIMARY KEY,
    auth_token UUID NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id BIGINT NOT NULL REFERENCES device_templates(template_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Online',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 📊 Telemetry Data: Time-series sensor data (partitioned)
CREATE TABLE telemetry_data (
    device_id INT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    field_id INT NOT NULL REFERENCES telemetry_fields(field_id) ON DELETE RESTRICT,
    value DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (device_id, field_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- 🎨 Widget Types: Predefined widget types (e.g., chart, gauge)
CREATE TABLE widgets (
    widget_id SERIAL PRIMARY KEY,
    widget_name VARCHAR(100) NOT NULL UNIQUE,
    widget_icon VARCHAR(255) NOT NULL,
    default_width SMALLINT NOT NULL DEFAULT 6,
    default_height SMALLINT NOT NULL DEFAULT 4,
    min_fields SMALLINT NOT NULL DEFAULT 1,
    max_fields SMALLINT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 📋 Dashboards: User-created dashboards
CREATE TABLE dashboards (
    dashboard_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dashboard_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 📌 Dashboard Widgets: Widgets added to dashboards
CREATE TABLE dashboard_widgets (
    id BIGSERIAL PRIMARY KEY,
    dashboard_id INT NOT NULL REFERENCES dashboards(dashboard_id) ON DELETE CASCADE,
    widget_id INT NOT NULL REFERENCES widgets(widget_id) ON DELETE RESTRICT,
    unique_key VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 📐 Dashboard Layouts: Stores widget layout positions
CREATE TABLE dashboard_layouts (
    layout_id SERIAL PRIMARY KEY,
    dashboard_widget_id INT NOT NULL REFERENCES dashboard_widgets(id) ON DELETE CASCADE,
    breakpoint VARCHAR(50) NOT NULL,
    width SMALLINT NOT NULL,
    height SMALLINT NOT NULL,
    x SMALLINT NOT NULL,
    y SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 🔗 Widget Fields: Maps widgets to telemetry fields from devices
CREATE TABLE widget_fields (
    id SERIAL PRIMARY KEY,
    widget_id INT NOT NULL REFERENCES dashboard_widgets(id) ON DELETE CASCADE,
    device_id INT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    field_id INT NOT NULL REFERENCES telemetry_fields(field_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE device_dashboards (
    id SERIAL PRIMARY KEY,
    dashboard_id INT NOT NULL REFERENCES dashboards(dashboard_id) ON DELETE CASCADE,
    device_id INT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    UNIQUE (dashboard_id),
    UNIQUE (device_id)
);


    /*
 CREATE
 OR REPLACE FUNCTION create_device_dashboard() RETURNS TRIGGER AS $$ DECLARE new_dashboard_id INT;
 
 BEGIN
 INSERT INTO
 dashboards (user_id, dashboard_name, description)
 VALUES
 (
 NEW.user_id,
 CONCAT('Device Dashboard - ', NEW.name),
 CONCAT('Dashboard for device ', NEW.name)
 ) RETURNING dashboard_id INTO new_dashboard_id;
 
 INSERT INTO
 device_dashboards (dashboard_id, device_id)
 VALUES
 (new_dashboard_id, NEW.device_id);
 
 RETURN NEW;
 
 END;
 
 $$ LANGUAGE plpgsql;
 */