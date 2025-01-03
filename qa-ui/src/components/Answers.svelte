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
        const response = await fetch(`/api/courses/${params.courseId}`,{
            method: "POST",
            body: JSON.stringify({ user: $userUuid }),
        });

        questions = await response.json();

        return questions;
    };

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
    const toggleUpvote = async (question_id) => {

        // update question votes
        await fetch(`/api/questions/${question_id}/votes`, {
            method: "PUT",
            body: JSON.stringify({ user: $userUuid }),
        });

        questionsPromise = getAnswers();

        // notify success
        messageSuccess = "You voted the question successfully!";
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


<!-- <div class="bg-gray-100 p-6 rounded-lg">
    {#await questionsPromise}
        <div class="text-gray-700">Loading questions...</div>
    {:then questions}
        {#if questions == null || questions.length == 0}
            <div class="text-red-500">No questions available</div>
        {:else}
            <h1 class="text-black-500 text-2xl font-medium mb-4">
                Questions in this Forum
            </h1>
            <p class="text-gray-600 text-base mb-6">
                Browse the questions raised by fellow learners. Vote on helpful ones or add your own to join the discussion!
            </p>
            <ul>
                <Table hoverable={true}>
                    <TableHead>
                      <TableHeadCell class="text-left">Question</TableHeadCell>
                      <TableHeadCell class="text-left">Likes</TableHeadCell>
                    </TableHead>
                    <TableBody tableBodyClass="divide-y w-full" style="width: 800px;">
                      {#each questions as question}
                        <TableBodyRow>
                          <TableBodyCell>
                            <a 
                            href={`/courses/${course.id}/questions/${question.id}/answers`} 
                            class="inline-flex items-center text-orange-500 hover:underline"
                            >
                                {question.question_title}
                            </a>
                          </TableBodyCell>
                          <TableBodyCell class="text-left">
                            {#if !question.voted}
                                <button
                                class="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 flex items-center"
                                on:click={() => toggleUpvote(question.id)}
                                >
                                <img
                                    src="like.svg"
                                    alt="Like"
                                    class="w-5 h-5 mr-2"
                                />
                                {question.vote_count}
                                </button>
                            {:else}
                                <div class="text-orange-500 flex items-center">
                                <img
                                    src="liked.svg"
                                    alt="Liked"
                                    class="w-5 h-5 mr-2"
                                />
                                {question.vote_count}
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
</div> -->



<style>
    .breadcrumb {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>