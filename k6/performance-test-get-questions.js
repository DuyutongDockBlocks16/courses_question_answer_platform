import http from "k6/http";

export const options = {
    duration: "5s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"],
  };

  export default function () {
    http.post(
      "http://localhost:7800/api/courses/1",
      JSON.stringify({
        user_uuid: `user-${Math.floor(Math.random() * 100000000000)}`,
      }),
    );
}

  // k6 run performance-test-get-questions.js



//   /\      Grafana   /‾‾/  
//   /\  /  \     |\  __   /  /   
//  /  \/    \    | |/ /  /   ‾‾\ 
// /          \   |   (  |  (‾)  |
// / __________ \  |_|\_\  \_____/ 

//    execution: local
//       script: performance-test-get-questions.js
//       output: -

//    scenarios: (100.00%) 1 scenario, 10 max VUs, 35s max duration (incl. graceful stop):
//             * default: 10 looping VUs for 5s (gracefulStop: 30s)


//    data_received..............: 9.2 MB  1.8 MB/s
//    data_sent..................: 1.1 MB  223 kB/s
//    http_req_blocked...........: med=2.82µs  p(99)=8.62µs  
//    http_req_connecting........: med=0s      p(99)=0s      
//    http_req_duration..........: med=6.06ms  p(99)=12.51ms 
//    http_req_failed............: 100.00% 7663 out of 7663
//    http_req_receiving.........: med=58.9µs  p(99)=133.02µs
//    http_req_sending...........: med=10.36µs p(99)=49.01µs 
//    http_req_tls_handshaking...: med=0s      p(99)=0s      
//    http_req_waiting...........: med=5.99ms  p(99)=12.43ms 
//    http_reqs..................: 7663    1531.21756/s
//    iteration_duration.........: med=6.14ms  p(99)=12.61ms 
//    iterations.................: 7663    1531.21756/s
//    vus........................: 10      min=10           max=10
//    vus_max....................: 10      min=10           max=10