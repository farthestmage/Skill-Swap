-- =========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
    created_at TIMESTAMP DEFAULT NOW(),
);

-- =========================================
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    profile_picture VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    availability VARCHAR(20) CHECK (availability IN ('WEEKDAYS', 'WEEKEND', 'BOTH')),
    is_visible BOOLEAN DEFAULT TRUE,
    skills_offered INT [] DEFAULT '{}',
    skills_wanted INT [] DEFAULT '{}',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================================
CREATE TABLE user_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    offered_skills INT [] DEFAULT '{}',
    wanted_skills INT [] DEFAULT '{}',
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
CREATE TABLE personal_requests (
    id SERIAL PRIMARY KEY,
    sender_user_id INT NOT NULL,
    receiver_user_id INT NOT NULL,
    offered_skills INT [] DEFAULT '{}',
    wanted_skills INT [] DEFAULT '{}',
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    reviewer_user_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (
        rating >= 1
        AND rating <= 5
    ),
    message TEXT,
    request_id INT,
    request_type VARCHAR(20) CHECK (request_type IN ('COMMON', 'PERSONAL')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_user_id INT NOT NULL,
    reported_user_id INT,
    reported_request_id INT,
    reported_request_type VARCHAR(20) CHECK (reported_request_type IN ('COMMON', 'PERSONAL')),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
CREATE TABLE banned_users (
    user_id INT PRIMARY KEY,
    reason TEXT,
    banned_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);