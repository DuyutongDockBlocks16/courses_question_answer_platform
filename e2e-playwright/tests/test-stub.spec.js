const { test, expect } = require("@playwright/test");

// test("Test stub", async ({ page }) => {
//   await page.goto("/");
// });

test("Server responds with a page with the title 'Yutong's Q&A platfrom'", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Yutong's Q&A platfrom");
});

test("Create a question", async ({ page }) => {
  await page.goto("/#/courses/1/questions");
  const question = "test question";
  const textareaLocator = page.locator('textarea'); // 确保选择器准确
  await textareaLocator.fill(question);
  await page.locator("#create-button").click();

  await page.waitForSelector('table tbody');

  // const pageContent = await page.content();
  // console.log("Page HTML after clicking submit:", pageContent);

  const firstQuestionLinkLocator = page.locator('table tbody tr:first-child a');
  await expect(firstQuestionLinkLocator).toHaveText(question);
});

test("Create a answer", async ({ page }) => {
  await page.goto("/#/courses/1/questions/1/answers");
  const answer = "test answer";
  const textareaLocator = page.locator('textarea'); // 确保选择器准确
  await textareaLocator.fill(answer);
  await page.locator("#create-button").click();
  
  await page.waitForSelector('table tbody');

  // const pageContent = await page.content();
  // console.log("Page HTML after clicking submit:", pageContent);

  const firstAnswerLocator = page.locator('table tbody tr:first-child td:first-child');
  await expect(firstAnswerLocator).toHaveText(answer);
});

test("Upvote a question", async ({ page }) => {
  await page.goto("/#/courses/1/questions");

  await page.waitForSelector('table tbody');
  
  const upvoteButtonLocator = page.locator('table tbody tr:first-child td:nth-child(2) button');

  await upvoteButtonLocator.waitFor({ state: 'visible' });
  await upvoteButtonLocator.click();

  const pageContent = await page.content();
  console.log("Page HTML after clicking submit:", pageContent);


  // 3. 定位到第一个表格行中的投票计数
  const firstVoteCountLocator = page.locator('table tbody tr:first-child td:last-child button .mr-2'); 



  // 4. 断言投票计数是否与预期一致
  await expect(firstVoteCountLocator).toHaveText('1'); 
});

test("Upvote a answer", async ({ page }) => {
  await page.goto("/#/courses/1/questions/1/answers");
  await page.waitForSelector('table tbody');
  
  const upvoteButtonLocator = page.locator('table tbody tr:first-child td:nth-child(2) button');

  await upvoteButtonLocator.waitFor({ state: 'visible' });
  await upvoteButtonLocator.click();

  const pageContent = await page.content();
  console.log("Page HTML after clicking submit:", pageContent);


  // 3. 定位到第一个表格行中的投票计数
  const firstVoteCountLocator = page.locator('table tbody tr:first-child td:last-child button .mr-2'); 



  // 4. 断言投票计数是否与预期一致
  await expect(firstVoteCountLocator).toHaveText('1'); 
});