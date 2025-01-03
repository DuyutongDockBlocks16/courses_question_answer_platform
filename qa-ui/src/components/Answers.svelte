<script>
    export let params = {};
    import { userUuid } from "../stores/stores.js";
    import { link } from "svelte-spa-router";
    import { Button, GradientButton } from 'flowbite-svelte';
    import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    import { Textarea } from 'flowbite-svelte';
    let textareaprops = {
        id: 'message',
        name: 'message',
        label: 'Your message',
        rows: 4,
        placeholder: 'Leave your Answer here...'
    };

    let Answers = [];

    const getAnswers = async () => {
        const response = await fetch(`/api/questions/${params.questionId}`,{
            method: "POST",
            body: JSON.stringify({ user: $userUuid }),
        });

        Answers = await response.json();

        return Answers;
    };

    let answersPromise = getAnswers();

    const getCourseName = async () =>{
        const response = await fetch(`/api/courseName/${params.courseId}`)

        let courseName = await response.json();

        return courseName;
    }

    let courseNamePromise = getCourseName();

    const getQuestionById = async () => {
        const response = await fetch(`/api/questions/${params.questionId}`,{
            method: "GET"
        });

        let questionInfo = await response.json();

        return questionInfo;
    };

    let questionInfoPromise = getQuestionById();

    let answerContent = "";

    const addAnswer = async () => {
        if (answerContent.length == 0) {
            return;
        }

        const answer = {
            answer_content: answerContent
        };

        const response = await fetch(`/api/questions/${params.questionId}/answers`, {
            method: "POST",
            body: JSON.stringify(answer),
        });

        answersPromise = getAnswers();

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

        // conquestionTitletent = "";

        // notify success
        // messageSuccess = "You created a question successfully!";
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

    // upvote
    const toggleUpvote = async (answer_id) => {

        // update question votes
        await fetch(`/api/answers/${answer_id}/votes`, {
            method: "PUT",
            body: JSON.stringify({ user: $userUuid }),
        });

        answersPromise = getAnswers();

        // notify success
        messageSuccess = "You voted the answer successfully!";
        setTimeout(() => {
            messageSuccess = null;
        }, 5000);
    };


</script>

<!-- <nav>
    <a class="text-blue-500 hover:underline flex items-center" use:link={"/"}>
        <img src="/BacktoHome.svg" alt="Back icon" class="w-4 h-4 mr-1">
        Back to home page
    </a>
</nav> -->

{#await questionInfoPromise}
    <div class="text-gray-700">Loading question...</div>
{:then questionInfo}
    {#if questionInfo == null || questionInfo.length == 0}
        <h1 class="text-red-500">Error question</h1>
    {:else}
        <Breadcrumb class="breadcrumb" aria-label="Solid background breadcrumb example" solid>
            <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
            <BreadcrumbItem>
                <a href={`/courses/${params.courseId}/questions`} use:link>Course Forum</a>
            </BreadcrumbItem>
            <BreadcrumbItem>Question & Answers</BreadcrumbItem>
        </Breadcrumb>

        <h1 class="text-orange-500 text-2xl font-bold mb-4">
            {questionInfo.question_title}
          </h1>
          <p class="text-gray-700 text-lg mb-6">
            <span class="font-medium text-gray-500">Likes:</span> 
            <span class="text-orange-600 font-semibold">{questionInfo.vote_count}</span> 
            <span class="mx-2 text-gray-500">|</span> 
            <span class="font-medium text-gray-500">Created at:</span> 
            <span class="text-orange-600">{questionInfo.created_at}</span> 
            <span class="mx-2 text-gray-500">|</span> 
            <span class="font-medium text-gray-500">Last modified by:</span> 
            <span class="text-orange-600">{questionInfo.updated_at}</span>
          </p>
    {/if}
{/await}

{#await courseNamePromise}
    <div class="text-gray-700">Loading course name...</div>
{:then courseName}
    {#if courseName == null || courseName.length == 0}
        <h1 class="text-red-500">Error course name</h1>
    {:else}
        <p class="text-gray-700 text-xs mb-4">
            <span class="font-medium text-gray-500">The question belongs to</span> 
            <a 
                href={`/courses/${params.courseId}/questions`} use:link
                class="text-orange-600 font-semibold hover:underline"
            >
                {courseName.course_name}
            </a>
        </p>
    {/if}
{/await}

<!-- <div class="create">
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
</div> -->

<Textarea {...textareaprops} bind:value={answerContent} />
<!-- <Button color="primary" pill>Blue</Button>
<Button class="text-center font-medium inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-green-500 hover:bg-green-600 rounded-full">
    Green Button
</Button>
<GradientButton shadow color="blue" on:click={addQuestion}>Blue</GradientButton> -->
<GradientButton 
    id="create-button" 
    shadow 
    class="text-center font-medium inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-full" 
    on:click={addAnswer}>
    <img src="/add-question.svg" alt="Add icon" class="w-5 h-5 mr-2">
    Submit answer
</GradientButton>


<div class="bg-gray-100 p-6 rounded-lg">
    {#await answersPromise}
        <div class="text-gray-700">Loading answers...</div>
    {:then answers}
        {#if answers == null || answers.length == 0}
            <div class="text-red-500">No answer here now...</div>
        {:else}
            <h1 class="text-black-500 text-2xl font-medium mb-4">
                Avaliable answers
            </h1>
            <ul>
                <Table hoverable={true}>
                    <TableHead>
                      <TableHeadCell class="text-left">Answer</TableHeadCell>
                      <TableHeadCell class="text-left">Likes</TableHeadCell>
                    </TableHead>
                    <TableBody tableBodyClass="divide-y w-full" style="width: 800px;">
                      {#each answers as answer}
                        <TableBodyRow>
                          <TableBodyCell>
                            {answer.answer_content}
                          </TableBodyCell>
                          <TableBodyCell class="text-left">
                            {#if !answer.voted}
                                <button
                                class="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 flex items-center"
                                on:click={() => toggleUpvote(answer.id)}
                                >
                                <img
                                    src="like.svg"
                                    alt="Like"
                                    class="w-5 h-5 mr-2"
                                />
                                {answer.vote_count}
                                </button>
                            {:else}
                                <div class="text-orange-500 flex items-center">
                                <img
                                    src="liked.svg"
                                    alt="Liked"
                                    class="w-5 h-5 mr-2"
                                />
                                {answer.vote_count}
                                </div>
                            {/if}
                          </TableBodyCell>
                        </TableBodyRow>
                      {/each}
                    </TableBody>
                </Table>
            </ul>
        {/if}
    {/await}
</div>



<style>
    .breadcrumb {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>