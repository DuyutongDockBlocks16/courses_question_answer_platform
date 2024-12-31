import { sql } from "../database/database.js";

const getCourses = async () => {

  const res = await sql`SELECT id, course_name FROM courses;`

  return res;
};

const getCourseNameById = async (course_id) => {

  const res = await sql`SELECT course_name FROM courses WHERE id = ${course_id} ;`


  return res[0];
};


export { getCourses, getCourseNameById };
