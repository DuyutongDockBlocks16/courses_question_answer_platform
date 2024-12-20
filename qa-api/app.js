import { serve } from "./deps.js";
import * as apiServices from "./services/QaService.js";
import { cacheMethodCalls } from "./utils/cacheUtil.js";

const cachedApiServices = cacheMethodCalls(
  apiServices,
  ["insertQuestion", "insertAnswer", "voteQuestionByQuestionId", "voteAnswerByAnswerId"],
);

const getAllCourses = async (request, urlPatternResult) => {
  return Response.json(await cachedApiServices.getCourses())
};

const postQuestion = async (request, urlPatternResult) => {
  const requestData = await request.json();
  
  const questionTitle = requestData.question_title;
  const courseId = urlPatternResult.pathname.groups.courseId;

  const questionId = await cachedApiServices.insertQuestion(courseId, questionTitle);

  return Response.json({
    questionId: questionId,
  });
};

const getQuestions = async (request, urlPatternResult) => {
  const courseId = urlPatternResult.pathname.groups.courseId;
  const requestData = await request.json();
  const user = requestData.user;

  return Response.json(await cachedApiServices.getQuestionsByCourseId(courseId, user))
};

const postAnswer = async (request, urlPatternResult) => {
  const requestData = await request.json();
  
  const answerContent = requestData.answer_content;
  const questionId = urlPatternResult.pathname.groups.questionId;

  const answerId = await cachedApiServices.insertAnswer(questionId, answerContent);

  return Response.json({
    answerId: answerId,
  });
};

const getAnswers = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.questionId;
  const requestData = await request.json();
  const user = requestData.user;

  return Response.json(await cachedApiServices.getAnswersByQuestionId(questionId, user))
};

const postQuestionVote = async (request, urlPatternResult) => {
  const questionId = urlPatternResult.pathname.groups.questionId;
  const requestData = await request.json();
  const user = requestData.user;

  const { vote_count, upvote_id } = await cachedApiServices.voteQuestionByQuestionId(questionId, user)

  return Response.json({
    voteCount: vote_count,
    upvoteId: upvote_id,
  });
};

const postAnswerVote = async (request, urlPatternResult) => {
  const answerId = urlPatternResult.pathname.groups.answerId;
  const requestData = await request.json();
  const user = requestData.user;

  const { vote_count, upvote_id } = await cachedApiServices.voteAnswerByAnswerId(answerId, user)

  return Response.json({
    voteCount: vote_count,
    upvoteId: upvote_id,
  });
};



// const handleRequest = async (request) => {
//   const data = await request.json();

//   const response = await fetch("http://llm-api:7000/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return response;
// };

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/courses" }),
    fn: getAllCourses,
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
    method: "POST",
    pattern: new URLPattern({ pathname: "/questions/:questionId/answers" }),
    fn: postAnswer,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/questions/:questionId/votes" }),
    fn: postQuestionVote,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/answers/:answerId/votes" }),
    fn: postAnswerVote,
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
