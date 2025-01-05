import http from "k6/http";

export const options = {
    duration: "5s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"],
  };

  export default function () {
    http.post(
      "http://localhost:7800/api/questions/1",
      JSON.stringify({
        user_uuid: `user-${Math.floor(Math.random() * 100000000000)}`,
      }),
    );
}

  // k6 run performance-test-get-answers.js


  
//   /\      Grafana   /‾‾/  
//   /\  /  \     |\  __   /  /   
//  /  \/    \    | |/ /  /   ‾‾\ 
// /          \   |   (  |  (‾)  |
// / __________ \  |_|\_\  \_____/ 

//    execution: local
//       script: performance-test-get-answers.js
//       output: -

//    scenarios: (100.00%) 1 scenario, 10 max VUs, 35s max duration (incl. graceful stop):
//             * default: 10 looping VUs for 5s (gracefulStop: 30s)


//    data_received..............: 8.8 MB  1.8 MB/s
//    data_sent..................: 1.1 MB  218 kB/s
//    http_req_blocked...........: med=2.99µs  p(99)=8.83µs  
//    http_req_connecting........: med=0s      p(99)=0s      
//    http_req_duration..........: med=6.33ms  p(99)=12.81ms 
//    http_req_failed............: 100.00% 7364 out of 7364
//    http_req_receiving.........: med=61.45µs p(99)=136.57µs
//    http_req_sending...........: med=10.81µs p(99)=45.05µs 
//    http_req_tls_handshaking...: med=0s      p(99)=0s      
//    http_req_waiting...........: med=6.25ms  p(99)=12.72ms 
//    http_reqs..................: 7364    1471.385265/s
//    iteration_duration.........: med=6.41ms  p(99)=12.91ms 
//    iterations.................: 7364    1471.385265/s
//    vus........................: 10      min=10           max=10
//    vus_max....................: 10      min=10           max=10


// running (05.0s), 00/10 VUs, 7364 complete and 0 interrupted iterations
// default ✓ [======================================] 10 VUs  5s