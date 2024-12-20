import { postgres } from "../deps.js";

const sql = postgres({ max: 20 });

export { sql };