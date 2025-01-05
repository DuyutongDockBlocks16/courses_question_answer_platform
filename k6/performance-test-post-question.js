import http from "k6/http";

export const options = {
  duration: "5s",
  vus: 10,
  summaryTrendStats: ["med", "p(99)"],
};

export default function () {
    http.post(
      "http://localhost:7800/api/courses/1/questions",
      JSON.stringify({
        user: `user-${Math.floor(Math.random() * 100000000000)}`,
        question_title: `question-${Math.floor(Math.random() * 1000)}`,
        question_id: 1,
      }),
    );
}


  // k6 run performance-test-post-question.js


  

//   /\      Grafana   /‾‾/  
//   /\  /  \     |\  __   /  /   
//  /  \/    \    | |/ /  /   ‾‾\ 
// /          \   |   (  |  (‾)  |
// / __________ \  |_|\_\  \_____/ 

//    execution: local
//       script: performance-test-post-question.js
//       output: -

//    scenarios: (100.00%) 1 scenario, 10 max VUs, 35s max duration (incl. graceful stop):
//             * default: 10 looping VUs for 5s (gracefulStop: 30s)


//    data_received..................: 1.2 MB 232 kB/s
//    data_sent......................: 1.2 MB 236 kB/s
//    http_req_blocked...............: med=3.37µs  p(99)=8.49µs  
//    http_req_connecting............: med=0s      p(99)=0s      
//    http_req_duration..............: med=7.62ms  p(99)=13.95ms 
//      { expected_response:true }...: med=7.62ms  p(99)=13.95ms 
//    http_req_failed................: 0.00%  0 out of 5931
//    http_req_receiving.............: med=52.55µs p(99)=125.72µs
//    http_req_sending...............: med=13.16µs p(99)=54.94µs 
//    http_req_tls_handshaking.......: med=0s      p(99)=0s      
//    http_req_waiting...............: med=7.54ms  p(99)=13.87ms 
//    http_reqs......................: 5931   1184.934409/s
//    iteration_duration.............: med=7.72ms  p(99)=14.05ms 
//    iterations.....................: 5931   1184.934409/s
//    vus............................: 10     min=10        max=10
//    vus_max........................: 10     min=10        max=10


// running (05.0s), 00/10 VUs, 5931 complete and 0 interrupted iterations
// default ✓ [======================================] 10 VUs  5s