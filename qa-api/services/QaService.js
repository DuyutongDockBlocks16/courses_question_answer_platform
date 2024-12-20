import { sql } from "../database/database.js";

const getCourses = async () => {

  const res = await sql`SELECT id, course_name FROM courses;`

  return res;
};

const insertQuestion = async (course_id, question_title) => {

  const res = await sql`INSERT INTO questions (course_id, question_title) VALUES (${course_id} , ${question_title}) RETURNING id`

  return res[0].id;
};


const getQuestionsByCourseId = async (course_id, user_uuid) => {
  const res = await sql
    `
    SELECT 
      q.*, 
      CASE 
          WHEN qu.id IS NOT NULL THEN true 
          ELSE false 
      END AS voted 
    FROM 
      questions q 
    LEFT JOIN 
      question_upvote qu ON q.id = qu.question_id AND qu.user_uuid = ${user_uuid} 
    WHERE 
      q.course_id = ${course_id} 
    ORDER BY 
      q.updated_at DESC;
    `;

  console.log("getQuestionsByCourseId res", res);
  return res;
};


const insertAnswer = async (question_id, answer_content) => {

  const res = await sql`INSERT INTO answers (question_id, answer_content) VALUES (${question_id} , ${answer_content}) RETURNING id`

  return res[0].id;
};

const getAnswersByQuestionId = async (question_id, user_uuid) => {
  const res = await sql
    `
    SELECT 
      a.*, 
      CASE 
          WHEN au.id IS NOT NULL THEN true 
          ELSE false 
      END AS voted 
    FROM 
      answers a
    LEFT JOIN 
    answer_upvote au ON a.id = au.answer_id AND au.user_uuid = ${user_uuid} 
    WHERE 
      a.question_id = ${question_id} 
    ORDER BY 
    a.updated_at DESC;
  `;

  console.log("getAnswersByQuestionId res", res);
  return res;
};

const voteQuestionByQuestionId = async (question_id, user_uuid) => {
  // 更新 questions 表的 vote_count 并返回新的 vote_count
  const res_questions = await sql`
    UPDATE questions 
    SET vote_count = vote_count + 1 ,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${question_id} 
    RETURNING vote_count
  `;

  // 插入 question_upvote 表，表示用户已投票，并返回生成的 id
  const res_question_upvote = await sql`
    INSERT INTO question_upvote (user_uuid, question_id) 
    VALUES (${user_uuid}, ${question_id}) 
    RETURNING id
  `;

  // 提取 vote_count 和 id
  const vote_count = res_questions[0]?.vote_count; // 从返回的数组中获取第一行的 vote_count
  const upvote_id = res_question_upvote[0]?.id;   // 从返回的数组中获取第一行的 id

  console.log("New vote_count:", vote_count);
  console.log("Inserted upvote_id:", upvote_id);

  // 返回结果
  return { vote_count, upvote_id };
};

const voteAnswerByAnswerId = async (answer_id, user_uuid) => {
  // 更新 answers 表的 vote_count 并返回新的 vote_count
  const res_answers = await sql`
    UPDATE answers 
    SET vote_count = vote_count + 1 ,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${answer_id} 
    RETURNING vote_count
  `;

  // 插入 answer_upvote 表，表示用户已投票，并返回生成的 id
  const res_answers_upvote = await sql`
    INSERT INTO answer_upvote (user_uuid, answer_id) 
    VALUES (${user_uuid}, ${answer_id}) 
    RETURNING id
  `;

  // 提取 vote_count 和 id
  const vote_count = res_answers[0]?.vote_count; // 从返回的数组中获取第一行的 vote_count
  const upvote_id = res_answers_upvote[0]?.id;   // 从返回的数组中获取第一行的 id

  console.log("New vote_count:", vote_count);
  console.log("Inserted upvote_id:", upvote_id);

  // 返回结果
  return { vote_count, upvote_id };
};



export { getCourses , insertQuestion , getQuestionsByCourseId , insertAnswer , getAnswersByQuestionId , voteQuestionByQuestionId , voteAnswerByAnswerId};

/////////////////////////////////////////////////////////

const insertSubmission = async (user_uuid, programming_assignment_id, code) => {

  const res = await sql`INSERT INTO programming_assignment_submissions (programming_assignment_id, code, user_uuid) VALUES (${programming_assignment_id} , ${code}, ${user_uuid}) RETURNING id`

  return res[0].id;
};


const getSubmissionByAssignmentIdAndCode = async (programming_assignment_id, code) => {
  const exist = await sql`SELECT * FROM programming_assignment_submissions WHERE programming_assignment_id = ${programming_assignment_id} AND code = ${code}`

  if (exist.length > 0) {
    console.log(exist)
    return exist[0].id;
  }

  return null;
};


const getSubmissionById = async (id) => {
  const res = await sql`SELECT * FROM programming_assignment_submissions WHERE id=${id};`;

  console.log("getSubmissionById res[0]", res[0]);
  return res[0];
};

const getAssignmentById = async (id) => {
  const res = await sql`SELECT id, title, assignment_order, handout FROM programming_assignments WHERE id=${id};`;

  return res[0];
};

const getAllAssignments = async () => {
  const res = await sql`SELECT id, assignment_order FROM programming_assignments;`;

  return res;
};
