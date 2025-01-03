import { sql } from "../database/database.js";


const insertQuestion = async (course_id, question_title) => {

    const res = await sql`INSERT INTO questions (course_id, question_title) VALUES (${course_id} , ${question_title}) RETURNING id`
  
    return res[0].id;
};

const getQuestionsInfoById = async (questionId) => {

    const res = await sql
    `
    SELECT
        question_title,
        vote_count,
        created_at,
        updated_at
    FROM
    questions
    WHERE 
    id = ${questionId} 
    `
    
    console.log("getQuestionsInfoById res", res);
    return res[0];
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

export { insertQuestion, getQuestionsInfoById,  getQuestionsByCourseId, voteQuestionByQuestionId };
