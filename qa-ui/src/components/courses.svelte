<script>
  import { link } from 'svelte-spa-router';

  import { userUuid } from "../stores/stores.js";

  import { Card, Button } from 'flowbite-svelte';
  import { ArrowRightOutline } from 'flowbite-svelte-icons';

  const fetchCourses = async () => {
        const response = await fetch(`api/courses`);
        return await response.json();
  };

  let coursesPromise = fetchCourses();

  
</script>

<h1 class="font-mono text-3xl font-bold mb-4">Welcome to Yutong's Q&A platform!</h1>

{#await coursesPromise}
    <div class="text-gray-700">Loading...</div>
{:then courses}
    <ul>
      {#each courses as course}
        <li> 

          <Card size="lg">
            <a href="/" use:link={`/courses/${course.id}/questions`}>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.course_name}</h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">If you have any questions about this course, please discuss it with us:</p>
            <a href="/" use:link={`/courses/${course.id}/questions`}>
              <Button class="w-fit">
                Go to Forum <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
              </Button>
            </a>
          </Card>

        </li>
      
      {/each}
    </ul>
{/await}

