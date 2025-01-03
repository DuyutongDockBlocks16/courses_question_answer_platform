import { serve } from "./deps.js";
import * as courseService from "./services/courseService.js";
import * as questionService from "./services/questionService.js";
import * as answerService from "./services/answerService.js";
import { cacheMethodCalls } from "./utils/cacheUtil.js";

const cachedCourseService = cacheMethodCalls(
  courseService, 
  [],
);

const cachedQuestionService = cacheMethodCalls(
  questionService,
  ["insertQuestion", "voteQuestionByQuestionId"],
);

const cachedAnswerService = cacheMethodCalls(
  answerService,
  ["insertAnswer", "voteAnswerByAnswerId"],
);

const getAllCourses = async (request, urlPatternResult) => {
  return Response.json(await cachedCourseService.getCourses())
};

const getCourseName = async (request, urlPatternResult) => {
  const courseId = urlPatternResult.pathname.groups.courseId;

  return Response.json(await cachedCourseService.getCourseNameById(courseId))
};

const postQuestion = async (request, urlPatternResult) => {
  const requestData = await request.json();
  
  const questionTitle = requestData.question_title;
  const courseId = urlPatternResult.pathname.groups.courseId;

  const questionId = await cachedQuestionService.insertQuestion(courseId, questionTitle);

  return Response.json({
    questionId: questionId,
  });
};

const getQuestions = async (request, urlPatternResult) => {
  const courseId = urlPatternResult.pathname.groups.courseId;
  const requestData = await request.json();
  const user = requestData.user;

  return Response.json(await cachedQuestionService.getQuestionsByCourseId(courseId, user))
};

const getQuestionInfo = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.questionId;

  const res = await cachedQuestionService.getQuestionsInfoById(questionId);
  console.log("getQuestionInfo res", res);

  return Response.json(res)
};

const postAnswer = async (request, urlPatternResult) => {
  const requestData = await request.json();
  
  const answerContent = requestData.answer_content;
  const questionId = urlPatternResult.pathname.groups.questionId;

  const answerId = await cachedAnswerService.insertAnswer(questionId, answerContent);

  return Response.json({
    answerId: answerId,
  });
};

const getAnswers = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.questionId;
  const requestData = await request.json();
  const user = requestData.user;

  return Response.json(await cachedAnswerService.getAnswersByQuestionId(questionId, user))
};

const putQuestionVote = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.questionId;
  const requestData = await request.json();
  const user = requestData.user;

  const { vote_count, upvote_id } = await cachedQuestionService.voteQuestionByQuestionId(questionId, user)

  return Response.json({
    voteCount: vote_count,
    upvoteId: upvote_id,
  });
};

const putAnswerVote = async (request, urlPatternResult) => {
  const answerId = urlPatternResult.pathname.groups.answerId;
  const requestData = await request.json();
  const user = requestData.user;

  const { vote_count, upvote_id } = await cachedAnswerService.voteAnswerByAnswerId(answerId, user)

  return Response.json({
    voteCount: vote_count,
    upvoteId: upvote_id,
  });
};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses" }),
    fn: getAllCourses,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courseName/:courseId" }),
    fn: getCourseName,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:courseId" }),
    fn: getQuestions,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/courses/:courseId/questions" }),
    fn: postQuestion,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/questions/:questionId" }),
    fn: getAnswers,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/questions/:questionId" }),
    fn: getQuestionInfo,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/questions/:questionId/answers" }),
    fn: postAnswer,
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/questions/:questionId/votes" }),
    fn: putQuestionVote,
  },
  {
    method: "PUT",
    pattern: new URLPattern({ pathname: "/answers/:answerId/votes" }),
    fn: putAnswerVote,
  },

];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) =>  um.method === request.method && um.pattern.test(request.url) ,
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
