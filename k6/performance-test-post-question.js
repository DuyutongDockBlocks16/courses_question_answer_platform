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
        user_uuid: `user-${Math.floor(Math.random() * 100000000000)}`,
        content: `question-${Math.floor(Math.random() * 1000)}`,
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


//    data_received..............: 8.7 MB  1.7 MB/s
//    data_sent..................: 1.3 MB  264 kB/s
//    http_req_blocked...........: med=2.73µs  p(99)=7.41µs  
//    http_req_connecting........: med=0s      p(99)=0s      
//    http_req_duration..........: med=6.1ms   p(99)=14.29ms 
//    http_req_failed............: 100.00% 7298 out of 7298
//    http_req_receiving.........: med=59.69µs p(99)=130.21µs
//    http_req_sending...........: med=10.46µs p(99)=43.66µs 
//    http_req_tls_handshaking...: med=0s      p(99)=0s      
//    http_req_waiting...........: med=6.02ms  p(99)=14.19ms 
//    http_reqs..................: 7298    1457.742005/s
//    iteration_duration.........: med=6.19ms  p(99)=14.42ms 
//    iterations.................: 7298    1457.742005/s
//    vus........................: 10      min=10           max=10
//    vus_max....................: 10      min=10           max=10


// running (05.0s), 00/10 VUs, 7298 complete and 0 interrupted iterations
// default ✓ [======================================] 10 VUs  5s