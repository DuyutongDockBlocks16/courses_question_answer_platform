# Performance test results

Brief description of the used server: HTTP/1.1 

Brief description of my computer:
  Model Name: DuYutong
  Model Identifier: x86_64
  Chip: AMD Ryzen 7 7840HS w/ Radeon 780M Graphics
  Total Number of Cores: 16
  Memory: 7.4Gi
  System Firmware Version: 5.15.167.4-microsoft-standard-WSL2


# Get Courses API

http_reqs: 13200 
http_req_duration - median: 2.69ms
http_req_duration - 99th percentile: =5.57ms 


# Get Questions API

http_reqs: 7663 
http_req_duration - median: 6.06ms
http_req_duration - 99th percentile: =12.51ms 

# Get Answers API

http_reqs: 7364 
http_req_duration - median: 6.33ms
http_req_duration - 99th percentile: =12.81ms 

# Post Question API

http_reqs: 5931 
http_req_duration - median: 7.62ms
http_req_duration - 99th percentile: =13.95ms 

# Post Answer API

http_reqs: 6800 
http_req_duration - median: 7.09ms
http_req_duration - 99th percentile: =12.41ms 
