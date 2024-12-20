CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name TEXT NOT NULL
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    question_title TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id),
    answer_content TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE question_upvote (
    id SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    question_id INTEGER REFERENCES questions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answer_upvote (
    id SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    answer_id INTEGER REFERENCES answers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX questions_course_id_idx ON questions (course_id);
CREATE INDEX answers_question_id_idx ON answers (question_id);

CREATE INDEX qu_user_uuid_idx ON question_upvote (user_uuid);
CREATE INDEX qu_question_id_idx ON question_upvote (question_id);

CREATE INDEX au_user_uuid_idx ON answer_upvote (user_uuid);
CREATE INDEX au_answer_id_idx ON answer_upvote (answer_id);