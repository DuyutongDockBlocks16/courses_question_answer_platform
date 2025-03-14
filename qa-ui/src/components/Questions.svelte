<script>
    export let params = {};
    import { userUuid } from "../stores/stores.js";
    import { link } from "svelte-spa-router";
    import { Button, GradientButton } from 'flowbite-svelte';
    import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Alert } from 'flowbite-svelte';
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    

    let showSuccessAlert = false;
    let showErrorAlert = false;
    let errorMessage = null;
    let successMessage = null;
    let courseNameForLLM = "";
    let page = 0;
    let load_size = 20;
    let displayedQuestions = [];
    let questions = [];

    import { Textarea } from 'flowbite-svelte';
    let textareaprops = {
        id: 'message',
        name: 'message',
        label: 'Your message',
        rows: 2,
        placeholder: 'Enter your question here...'
    };

    const getCourseName = async () =>{
        const response = await fetch(`/api/courseName/${params.courseId}`)

        let courseName = await response.json();
        courseNameForLLM = courseName.course_name

        return courseName;
    }

    let courseNamePromise = getCourseName();

    const getQuestions = async () => {
        const response = await fetch(`/api/courses/${params.courseId}`,{
            method: "POST",
            body: JSON.stringify({ user: $userUuid }),
        });

        questions = await response.json();

        // page = 0;
        // displayedQuestions = [...questions.slice(0, size)];

        return questions;
    };

    let questionsPromise = getQuestions();

    let questionTitle = "";

    const addQuestion = async () => {
        
        if (!questionTitle.trim()) {
            return;
        }
        
        if (questionTitle.length == 0) {
            return;
        }

        const question = {
            question_title: questionTitle,
            user: $userUuid
        };

        const response = await fetch(`/api/courses/${params.courseId}/questions`, {
            method: "POST",
            body: JSON.stringify(question),
        });

        questionsPromise = getQuestions();

        // error
        if (!response.ok) {
            if (response.status === 429) {
                const errorData = await response.json();
                errorMessage = errorData.error || "Too many requests. Please try again later.";
            } else {
                errorMessage = "An error occurred. Please try again.";
            }
            showErrorAlert = true;
            setTimeout(() => {
                showErrorAlert = false; // 自动清除错误消息
            }, 6000); // 5秒后隐藏错误
            return;
        }


        // notify success

        successMessage = 'Thank you! You created a new question!';
        showSuccessAlert = true;

        setTimeout(() => {
            showSuccessAlert = false; // 自动隐藏
        }, 3000);

    // create 3 answers by llm
        try {
            const newQuestionData = await response.json();
            fetch("/api/llm-api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    course_name: courseNameForLLM,
                    question_id: newQuestionData.questionId,
                    question_title: questionTitle
                }),
            });
        } catch (error) {
            console.error("Failed to generate answers via LLM:", error);
        }
    };

    // upvote
    const toggleUpvote = async (question_id) => {

        // update question votes
        await fetch(`/api/questions/${question_id}/votes`, {
            method: "PUT",
            body: JSON.stringify({ user: $userUuid }),
        });

        questionsPromise = getQuestions();

        // notify success
        messageSuccess = "You voted the question successfully!";
        setTimeout(() => {
            messageSuccess = null;
        }, 5000);
    };


</script>

  
<!-- Alert 组件 -->
{#if showSuccessAlert}
<Alert color="green" class="fade {showSuccessAlert ? '' : 'out'}">
    <InfoCircleSolid slot="icon" class="w-5 h-5" />
    <span class="font-medium">{successMessage}</span>
</Alert>
{/if}

{#if showErrorAlert}
<Alert>
    <InfoCircleSolid slot="icon" class="w-5 h-5" />
    <span class="font-medium">{errorMessage}</span>
</Alert>
{/if}

{#await courseNamePromise}
    <div class="text-gray-700">Loading course name...</div>
{:then courseName}
    {#if courseName == null || courseName.length == 0}
        <h1 class="text-red-500">Error course name</h1>
    {:else}
        <Breadcrumb class="breadcrumb" aria-label="Solid background breadcrumb example" solid>
            <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
            <BreadcrumbItem>Course Forum</BreadcrumbItem>
        </Breadcrumb>

        <h1 class="text-black-500 text-xl font-medium mb-4">
            Discover and Discuss Questions in {courseName.course_name} Forum
        </h1>
        <p class="text-gray-600 text-base mb-6">
        Welcome to the Q&A platform for {courseName.course_name}. Explore existing questions or start your own discussion to gain insights and share knowledge.
        </p>
          
    {/if}
{/await}


<Textarea {...textareaprops} bind:value={questionTitle} />

<GradientButton 
    id="create-button" 
    shadow 
    class="text-center font-medium inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-full" 
    on:click={addQuestion}>
    <img src="/add-question.svg" alt="Add icon" class="w-5 h-5 mr-2">
    Submit question
</GradientButton>


<div class="bg-gray-100 p-6 rounded-lg">
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
                      <!-- <TableHeadCell class="text-left">Votes Count</TableHeadCell> -->
                      <TableHeadCell class="text-left">Likes</TableHeadCell>
                    </TableHead>
                    <TableBody tableBodyClass="divide-y w-full" style="width: 800px;">
                      {#each questions as question}
                        <TableBodyRow>
                          <TableBodyCell>
                            <a 
                                href="/" use:link={`/courses/${params.courseId}/questions/${question.id}/answers`}
                                class="inline-flex items-center text-orange-500 hover:underline"
                            >
                                {question.question_title}
                            </a>
                          </TableBodyCell>
                          <!-- <TableBodyCell class="text-left">
                            <span class="text-gray-500">{question.vote_count}</span>
                          </TableBodyCell> -->
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
                                {question.vote_count}&nbsp;&nbsp;&nbsp;
                                </button>
                            {:else}
                                <!-- 已点赞的图标 -->
                                <div class="text-orange-500 flex items-center">
                                <img
                                    src="liked.svg"
                                    alt="Liked"
                                    class="w-5 h-5 mr-2"
                                />
                                {question.vote_count}
                                </div>
                            {/if}
                            <!-- <button
                              class="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                              on:click={() => upvote(question.id)}
                            >
                              Upvote
                            </button> -->
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
    .fade {
      transition: opacity 0.3s ease;
    }
    .fade.out {
      opacity: 0;
    }
</style>