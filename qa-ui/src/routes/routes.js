import Courses from "../components/Courses.svelte";
import Questions from "../components/Questions.svelte";
// import Answers from "../components/Answers.svelte";

const routes = {
  '/': Courses,
  '/courses/:courseId/questions': Questions,
  // '/courses/:courseId/questions/:questionId/answers': Answers,
}

export default routes;