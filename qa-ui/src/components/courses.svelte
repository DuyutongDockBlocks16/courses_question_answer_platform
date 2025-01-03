<script>
  import { link } from 'svelte-spa-router';

  import { userUuid } from "../stores/stores.js";

  import { Card } from 'flowbite-svelte';
  import { UsersGroupSolid, ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

  const fetchCourses = async () => {
        const response = await fetch(`api/courses`);
        return await response.json();
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
        <li class="block w-1/3"> <!-- 设置宽度以便在一行中显示多个元素 -->
          <Card class="flex flex-col space-y-4 mb-4">
            <UsersGroupSolid class="w-8 h-8 text-gray-500 dark:text-gray-400" />
            <a href="/" use:link={`/courses/${course.id}/questions`}>
              <h5 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {course.course_name}
              </h5>
            </a>
            <p class="font-normal text-gray-500 dark:text-gray-400">
              If you have any questions about this course, please discuss it with us:
            </p>
            <a href="/" class="inline-flex items-center text-orange-500 hover:underline" use:link={`/courses/${course.id}/questions`}>
              Go to Q&A Forum
              <ArrowUpRightFromSquareOutline class="w-4 h-4 ms-2.5" />
            </a>
          </Card>
        </li>
      
          <!-- <button 
            class="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            on:click={() => {
                const targetUrl = `/qa?courseId=${course.id}&userUuid=${$userUuid}`;
                console.log("Navigating to:", targetUrl); // 输出生成的 URL
                window.location.href = targetUrl;
            }}>
            Go to Q&A Forum
          </button> -->
      {/each}
    </ul>
{/await}
<!-- <button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded m-4"
  on:click={askSomething}
>
  Test!
</button> -->
