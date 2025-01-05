import http from "k6/http";

export const options = {
  duration: "5s",
  vus: 10,
  summaryTrendStats: ["med", "p(99)"],
};

export default function () {
    http.post(
      "http://localhost:7800/api/questions/1/answers",
      JSON.stringify({
        user: `user-${Math.floor(Math.random() * 100000000000)}`,
        answer_content: `answer-${Math.floor(Math.random() * 1000)}`,
      }),
    );
}

  // k6 run performance-test-post-answer.js

  

//   /\      Grafana   /‾‾/  
//   /\  /  \     |\  __   /  /   
//  /  \/    \    | |/ /  /   ‾‾\ 
// /          \   |   (  |  (‾)  |
// / __________ \  |_|\_\  \_____/ 

//    execution: local
//       script: performance-test-post-answer.js
//       output: -

//    scenarios: (100.00%) 1 scenario, 10 max VUs, 35s max duration (incl. graceful stop):
//             * default: 10 looping VUs for 5s (gracefulStop: 30s)


//    data_received..................: 1.3 MB 263 kB/s
//    data_sent......................: 1.2 MB 246 kB/s
//    http_req_blocked...............: med=3.15µs  p(99)=7.14µs  
//    http_req_connecting............: med=0s      p(99)=0s      
//    http_req_duration..............: med=7.09ms  p(99)=12.41ms 
//      { expected_response:true }...: med=7.09ms  p(99)=12.41ms 
//    http_req_failed................: 0.00%  0 out of 6800
//    http_req_receiving.............: med=47.95µs p(99)=126.07µs
//    http_req_sending...............: med=12.6µs  p(99)=44.66µs 
//    http_req_tls_handshaking.......: med=0s      p(99)=0s      
//    http_req_waiting...............: med=7.02ms  p(99)=12.35ms 
//    http_reqs......................: 6800   1358.387107/s
//    iteration_duration.............: med=7.17ms  p(99)=12.5ms  
//    iterations.....................: 6800   1358.387107/s
//    vus............................: 10     min=10        max=10
//    vus_max........................: 10     min=10        max=10


// running (05.0s), 00/10 VUs, 6800 complete and 0 interrupted iterations
// default ✓ [======================================] 10 VUs  5s