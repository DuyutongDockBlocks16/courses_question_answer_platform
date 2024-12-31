<script>
    export let params = {};
    import { userUuid } from "../stores/stores.js";
    import { link } from "svelte-spa-router";

    let questions = [];

    const getCourseName = async () =>{
        const response = await fetch(`/api/courseName/${params.courseId}`)

        let courseName = await response.json();

        return courseName;
    }

    let courseNamePromise = getCourseName();

    const getQuestions = async () => {
        const response = await fetch(`/api/courses/${params.courseId}`,{
            method: "POST",
            body: JSON.stringify({ user: $userUuid }),
        });

        questions = await response.json();

        return questions;
    };

    let questionsPromise = getQuestions();

    let questionTitle = "";

    const addQuestion = async () => {
        if (questionTitle.length == 0) {
            return;
        }

        const question = {
            question_title: questionTitle
        };

        const response = await fetch(`/api/courses/${params.courseId}/questions`, {
            method: "POST",
            body: JSON.stringify(question),
        });

        questionsPromise = getQuestions();

        // error
        if (!response.ok) {
            // if (response.status === 429) {
            //     // < 1 min, too many requests
            //     const errorData = await response.json();
            //     messageError = errorData.error;
            // } else {
            //     // other errors
            //     messageError = "An error occurred.";
            // }
            // setTimeout(() => {
            //     messageError = null;
            // }, 5000);
            // console.log("error: < 1 min");
            messageError = "An error occurred.";
            return;
        }

        conquestionTitletent = "";

        // notify success
        messageSuccess = "You created a question successfully!";
        // setTimeout(() => {
        //     messageSuccess = null;
        // }, 5000);

        // generate 3 answers via llm
        // const addedQuestionData = await response.json();

        // await fetch("/api/llm-api", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         question_id: addedQuestionData.id,
        //         question: addedQuestionData.content,
        //         user_uuid: "llm",
        //     }),
        // });
    };


</script>
  
<nav>
    <a class="text-blue-500 hover:underline flex items-center" use:link={"/"}>
        <img src="/BacktoHome.svg" alt="Back icon" class="w-4 h-4 mr-1">
        Back to home page
    </a>
</nav>

{#await courseNamePromise}
    <div class="text-gray-700">Loading course name...</div>
{:then courseName}
    {#if courseName == null || courseName.length == 0}
        <h1 class="text-red-500">Error course name</h1>
    {:else}
        <h1 class="text-black-500">Welcome to Forum of {courseName.course_name}!</h1>
    {/if}
{/await}

<div class="create">
    <input 
        type="text" 
        bind:value={questionTitle} 
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your question here"
    />
    <button id="create-button" class="flex items-center px-4 py-2 bg-blue-500 text-white rounded ml-2" on:click={addQuestion}>
        <img src="/add-question.svg" alt="Add icon" class="w-5 h-5 mr-2">
        Add question
    </button>
</div>


{#await questionsPromise}
    <div class="text-gray-700">Loading questions...</div>
{:then questions}
    {#if questions == null || questions.length == 0}
        <div class="text-red-500">No questions available</div>
    {:else}
        <ul>
            {#each questions as question}
                <li>
                    <div class="item">
                        <div class="content">
                            <!-- <a class="text-black-500 hover:underline" use:link={`/courses/${params.id}/questions/${question.id}/answers`}>
                                {question.content}</a> -->
                            <a>
                                {question.question_title}
                            </a>
                        </div>
                        <div class="vote">
                            <div class="mr-4">
                                <span class="text-gray-500"
                                    >votes: {question.vote_count}</span>
                            </div>
                            <button on:click={() => upvote(question.id)}
                                >upvote</button
                            >
                        </div>
                    </div>
                </li>
            {/each}
            <InfiniteScroll threshold={50} on:loadMore={loadMorePage} />
        </ul>
    {/if}
{/await}