<script>
  import { userUuid } from "../stores/stores.js";

  const fetchCourses = async () => {
        const response = await fetch(`api/courses`);
        return await response.json();
  };

  const goToForum = async (courseId, userUuid) => {

  };

  let coursesPromise = fetchCourses();

  
  // const askSomething = async () => {
  //   const data = {
  //     user: $userUuid,
  //     question: "???",
  //   };
    
  //   const response = await fetch("/api/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   const jsonData = await response.json();
  //   console.log(jsonData);
  //   alert(JSON.stringify(jsonData));
  // };
</script>

<h1 class="font-mono text-3xl font-bold mb-4">Welcome to Yutong's Q&A platform!</h1>

{#await coursesPromise}
    <div class="text-gray-700">Loading...</div>
{:then courses}
    <ul>
      {#each courses as course}
          <li>
              <!-- 假设课程对象有一个名为 name 的属性 -->
              <h2 class="font-bold">{course.course_name}</h2>
              <!-- 如果需要，可以添加更多课程信息 -->
          </li>
          <button 
            class="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            on:click={() => {
                const targetUrl = `/qa?courseId=${course.id}&userUuid=${$userUuid}`;
                console.log("Navigating to:", targetUrl); // 输出生成的 URL
                window.location.href = targetUrl;
            }}>
            Go to Q&A Forum
          </button>
      {/each}
    </ul>
{/await}
<!-- <button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
  on:click={askSomething}
>
  Test!
</button> -->
