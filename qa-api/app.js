import { serve } from "./deps.js";
import * as courseService from "./services/courseService.js";
import * as questionService from "./services/questionService.js";
import * as answerService from "./services/answerService.js";
import * as lastPostService from "./services/lastPostService.js";
import { cacheMethodCalls } from "./utils/cacheUtil.js";

const OPERATION_TIME_INTERVAL = 60000 // 1 min

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
  const user_uuid = requestData.user;
  const courseId = urlPatternResult.pathname.groups.courseId;

  // check 1 min
  const last_created = await cachedQuestionService.getLastPostTimeByUserId(user_uuid);

  if (last_created) {
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - (new Date(last_created)).getTime();

    // time less than 1 min
    if (timeDifference < OPERATION_TIME_INTERVAL) {
      return new Response(
        JSON.stringify({
          error: "Hold on! You can post another question in a minute. Thanks for your patience!",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  const questionId = await cachedQuestionService.insertQuestion(courseId, questionTitle, user_uuid);

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
  const user_uuid = requestData.user;
  const questionId = urlPatternResult.pathname.groups.questionId;

  const last_created = await cachedAnswerService.getLastPostTimeByUserId(user_uuid);

  if (last_created) {
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - (new Date(last_created)).getTime();

    if (timeDifference < OPERATION_TIME_INTERVAL) {
      return new Response(
        JSON.stringify({
          error: "Hold on! You can post another answer in a minute. Thanks for your patience!",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  const answerId = await cachedAnswerService.insertAnswer(questionId, answerContent, user_uuid);

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

const fetchLlmAnswers = async (request) => {
  // get 3 answers from llm-api
  const requestData = await request.json();

  let answers = [];

  const user_uuid_for_llm = "llm";

  for (let i = 0; i < 3; i++) {
    console.log("Fetching answer ", i + 1);

    const response = await fetch("http://llm-api:7000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const answer = await response.json();

    console.log("answer", answer);

    let post_answer = answer[0]["generated_text"] + " PS: This answer generated by Facebook's OPT-125M LLM"

    console.log("post_answer", post_answer);

    // todo
    answers.push(post_answer)
  }

  // add the 3 answers
  const question_id = requestData.question_id;

  answers.forEach(async (answer) => {
    const answer_content = answer;
    await cachedAnswerService.insertAnswer(
      question_id,
      answer_content,
      user_uuid_for_llm
    );
  });

  return new Response(JSON.stringify(answers));
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
  {
    method: "POST",
    pattern: new URLPattern({
      pathname: "/llm-api",
    }),
    fn: fetchLlmAnswers,
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
