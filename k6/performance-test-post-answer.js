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
        user_uuid: `user-${Math.floor(Math.random() * 100000000000)}`,
        content: `answer-${Math.floor(Math.random() * 1000)}`,
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


//    data_received..............: 8.6 MB  1.7 MB/s
//    data_sent..................: 1.3 MB  258 kB/s
//    http_req_blocked...........: med=2.75µs  p(99)=6.91µs  
//    http_req_connecting........: med=0s      p(99)=0s      
//    http_req_duration..........: med=6.45ms  p(99)=13.13ms 
//    http_req_failed............: 100.00% 7207 out of 7207
//    http_req_receiving.........: med=61.68µs p(99)=131.31µs
//    http_req_sending...........: med=10.96µs p(99)=41.63µs 
//    http_req_tls_handshaking...: med=0s      p(99)=0s      
//    http_req_waiting...........: med=6.37ms  p(99)=13ms    
//    http_reqs..................: 7207    1440.17056/s
//    iteration_duration.........: med=6.53ms  p(99)=13.22ms 
//    iterations.................: 7207    1440.17056/s
//    vus........................: 10      min=10           max=10
//    vus_max....................: 10      min=10           max=10


// running (05.0s), 00/10 VUs, 7207 complete and 0 interrupted iterations
// default ✓ [======================================] 10 VUs  5s