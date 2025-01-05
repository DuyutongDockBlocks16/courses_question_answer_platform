import http from "k6/http";

export const options = {
  duration: "5s",
  vus: 10,
  summaryTrendStats: ["med", "p(99)"],
};

export default function () {
  http.get("http://localhost:7800/api/courses");
}

  // k6 run performance-test-get-courses.js

  

//   /\      Grafana   /‾‾/  
//   /\  /  \     |\  __   /  /   
//  /  \/    \    | |/ /  /   ‾‾\ 
// /          \   |   (  |  (‾)  |
// / __________ \  |_|\_\  \_____/ 

//    execution: local
//       script: performance-test-get-courses.js
//       output: -

//    scenarios: (100.00%) 1 scenario, 10 max VUs, 35s max duration (incl. graceful stop):
//             * default: 10 looping VUs for 5s (gracefulStop: 30s)


//    data_received..................: 7.3 MB 1.5 MB/s
//    data_sent......................: 1.6 MB 312 kB/s
//    http_req_blocked...............: med=2.08µs  p(99)=6.75µs  
//    http_req_connecting............: med=0s      p(99)=0s      
//    http_req_duration..............: med=2.69ms  p(99)=5.57ms  
//      { expected_response:true }...: med=2.69ms  p(99)=5.57ms  
//    http_req_failed................: 0.00%  0 out of 17149
//    http_req_receiving.............: med=44.35µs p(99)=110.89µs
//    http_req_sending...............: med=6.44µs  p(99)=26.15µs 
//    http_req_tls_handshaking.......: med=0s      p(99)=0s      
//    http_req_waiting...............: med=2.64ms  p(99)=5.48ms  
//    http_reqs......................: 17149  3428.133658/s
//    iteration_duration.............: med=2.74ms  p(99)=5.63ms  
//    iterations.....................: 17149  3428.133658/s
//    vus............................: 10     min=10         max=10
//    vus_max........................: 10     min=10         max=10


// running (05.0s), 00/10 VUs, 17149 complete and 0 interrupted iterations
// default ✓ [======================================] 10 VUs  5s