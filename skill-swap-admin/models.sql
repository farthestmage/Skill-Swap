DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS admin_messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT
);

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    description TEXT,
    ai_moderation_status VARCHAR(20),
    ai_moderation_reason TEXT,
    reviewed_by_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE admin_messages (
    message_id SERIAL PRIMARY KEY,
    to_user_id INT REFERENCES users(user_id),
    message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    swap_id INT,        -- FK if you add a swaps table
    reviewer_user_id INT REFERENCES users(user_id),
    reviewee_user_id INT REFERENCES users(user_id),
    overall_rating INT,
    comment TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ai_moderation_status VARCHAR(20),
    ai_moderation_reason TEXT,
    reviewed_by_admin BOOLEAN DEFAULT FALSE
);
