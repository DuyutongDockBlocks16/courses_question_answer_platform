import { sql } from "../database/database.js";

const getCourses = async () => {

  const res = await sql`SELECT id, course_name FROM courses;`

  return res;
};

export { getCourses };
