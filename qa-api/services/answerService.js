import { sql } from "../database/database.js";


const insertAnswer = async (question_id, answer_content, user_uuid) => {

  const res = await sql`INSERT INTO answers (question_id, answer_content, user_uuid) VALUES (${question_id} , ${answer_content}, ${user_uuid}) RETURNING id`

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

const getLastPostTimeByUserId = async (user_uuid) => {
  const res = await sql`SELECT created_at FROM answers WHERE user_uuid = ${user_uuid} ORDER BY created_at DESC LIMIT 1;`
  if (res && res.length > 0){
    return res[0].created_at;
  }
  return null;
};

export {  insertAnswer , getAnswersByQuestionId  , voteAnswerByAnswerId, getLastPostTimeByUserId};
