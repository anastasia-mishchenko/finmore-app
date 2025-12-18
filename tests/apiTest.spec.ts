import { test, expect } from '@playwright/test';
import { WordPressAPI, PostData } from '../wordpress-api/WordpressApi';
import { apiTestTerms } from '../test-data/apiTestTerms';
import { validateDate } from '../utils/validateDateAPI';
import { validateURL } from '../utils/validateUrlAPI';

const BASE_URL = apiTestTerms.baseUrl;
const USERNAME = process.env.WP_USERNAME || apiTestTerms.defaultUsername;
const PASSWORD = process.env.WP_PASSWORD || apiTestTerms.defaultPassword;
 
let wpApi: WordPressAPI;
let createdPostId: number;
 //comment comment comment
test.describe.serial('WordPress REST API CRUD Operations', () => {
  test.beforeAll(async () => {
    wpApi = new WordPressAPI(BASE_URL, USERNAME, PASSWORD);
    await wpApi.initialize();
  });
 
  test.afterAll(async () => {
    await wpApi.cleanup();
  });
 
  test('should create a new post', async () => {
    const postData: PostData = {
      title: apiTestTerms.postData.initialTitle,
      content: apiTestTerms.postData.initialContent,
      status: apiTestTerms.status.draft,
      excerpt: apiTestTerms.postData.initialExcerpt,
      categories: [apiTestTerms.testConstants.defaultCategoryId]
    };

    const response = await wpApi.createPost(postData);
    
    if (!response.ok()) {
      const errorText = await response.text();
      console.error('Response status:', response.status());
      console.error('Error response:', errorText);
    }
    
    expect(response.ok()).toBeTruthy();

    const post = await response.json();
    createdPostId = post.id;
    console.log('Created Post ID:', createdPostId);
    expect(post.id).toBeDefined();
    expect(post.title.rendered).toEqual(postData.title);
    expect(post.status).toBe(apiTestTerms.status.draft);
    expect(validateDate(post.date)).toBeDefined();
    expect(validateURL(post.link)).toBeDefined();
    expect(validateURL(post.guid.rendered)).toBeDefined();
    expect(validateURL(post.guid.raw)).toBeDefined();
    expect(post.content.protected).toBe(false);
    expect(post.sticky).toBe(false);
    const categories = post.categories;
    expect(categories.length).toBeGreaterThan(0);
    const classList = post.class_list;
    expect(classList[0]).toBe(`post-${createdPostId}`);
  });

  test('check that status set to draft after creation', async () => {
    const response = await wpApi.getPost(createdPostId);
    expect(response.ok()).toBeTruthy();
    const post = await response.json();
    expect(post.status).toBe(apiTestTerms.status.draft);
  });

  test('change status from draft to publish', async () => {
    const response = await wpApi.changePostStatus(createdPostId, apiTestTerms.status.publish);
    expect(response.ok()).toBeTruthy();
    const post = await response.json();
    expect(post.status).toBe(apiTestTerms.status.publish);
  });

  test('should retrieve a post by ID', async () => {
    const response = await wpApi.getPost(createdPostId);
    expect(response.ok()).toBeTruthy();
    const post = await response.json();
    expect(post.id).toBe(createdPostId);
    expect(post.title.rendered).toBe(apiTestTerms.postData.initialTitle);
    expect(post.status).toBe(apiTestTerms.status.publish);
  });
 
  test('should update the post', async () => {
    const updateData: Partial<PostData> = {
      title: apiTestTerms.postData.updatedTitle,
      status: apiTestTerms.status.publish
    };

    const response = await wpApi.updatePost(createdPostId, updateData);
    expect(response.ok()).toBeTruthy();

    const updatedPost = await response.json();
    expect(updatedPost.title.rendered).toBe(apiTestTerms.postData.updatedTitle);
    expect(updatedPost.status).toBe(apiTestTerms.status.publish);
  });

  test('check that status is future if scheduled date is set', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + apiTestTerms.testConstants.daysInFuture);
    const isoFutureDate = futureDate.toISOString();

    const response = await wpApi.updatePost(createdPostId, {
      date: validateDate(isoFutureDate),
    });
    expect(response.ok()).toBeTruthy();

    const updatedPost = await response.json();
    expect(updatedPost.status).toBe(apiTestTerms.status.future);
    expect(validateDate(updatedPost.date)).toBeDefined();
  });
 
  test('should retrieve all posts', async () => {
    const response = await wpApi.getAllPosts({ per_page: apiTestTerms.testConstants.postsPerPage });
    expect(response.ok()).toBeTruthy();

    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
  });
 
  test('should delete the post (move to trash)', async () => {
    const response = await wpApi.deletePost(createdPostId);
    expect(response.ok()).toBeTruthy();
    const post = await response.json();
    expect(post.id).toBe(createdPostId);
    expect(post.status).toBe(apiTestTerms.status.trash);
  });

  test('should permanently delete the post', async () => {
    const response = await wpApi.permanentlyDeletePost(createdPostId);
    expect(response.ok()).toBeTruthy();
    const post = await response.json();
    expect(post.deleted).toBe(true);
    expect(post.previous.id).toBe(createdPostId);
  });

  test('[Negative] Author cannot create post if content and title are empty', async () => {
    const postData: PostData = {
      title: apiTestTerms.postData.emptyTitle,
      content: apiTestTerms.postData.emptyContent,
      status: apiTestTerms.status.private
    };

    const response = await wpApi.createPost(postData);
    
    expect(response.status()).toBe(apiTestTerms.errorResponses.emptyContent.status);
    
    const errorResponse = await response.json();
    expect(errorResponse.code).toBe(apiTestTerms.errorResponses.emptyContent.code);
    expect(errorResponse.message).toBe(apiTestTerms.errorResponses.emptyContent.message);
    expect(errorResponse.data.status).toBe(apiTestTerms.errorResponses.emptyContent.status);
  });

  test('[Negative] Send invalid status', async () => {
    const postData: PostData = {
      title: apiTestTerms.postData.emptyTitle,
      content: apiTestTerms.postData.emptyContent,
      status: ' ' as any
    };
    const response = await wpApi.createPost(postData);
    expect(response.status()).toBe(apiTestTerms.errorResponses.invalidParam.status);
    const errorResponse = await response.json();
    expect(errorResponse.code).toBe(apiTestTerms.errorResponses.invalidParam.code);
    expect(errorResponse.message).toBe(apiTestTerms.errorResponses.invalidParam.message);
    expect(errorResponse.data.status).toBe(apiTestTerms.errorResponses.invalidParam.status);
    expect(errorResponse.data.params.status).toBe(apiTestTerms.errorResponses.invalidParam.statusParamMessage);
  });

  test('[Negative] Update post with non-existing ID', async () => {
    const response = await wpApi.updatePost(apiTestTerms.testConstants.nonExistingPostId, {
      title: apiTestTerms.postData.updatedTitle
    });
    expect(response.status()).toBe(apiTestTerms.errorResponses.invalidPostId.status);
    const errorResponse = await response.json();
    expect(errorResponse.code).toBe(apiTestTerms.errorResponses.invalidPostId.code);
    expect(errorResponse.message).toBe(apiTestTerms.errorResponses.invalidPostId.message);
  });
});


