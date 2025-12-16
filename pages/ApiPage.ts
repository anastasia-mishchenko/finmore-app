import {test, expect} from '@playwright/test';
import { WordPressAPI, PostData } from '../wordpress-api/WordpressApi';    
 
async function runCRUDExample() {
  const BASE_URL = 'https://dev.emeli.in.ua/wp-json';
  const USERNAME = 'admin';
  const PASSWORD = 'Enginner_123'; 

  const wpApi = new WordPressAPI(BASE_URL, USERNAME, PASSWORD);
  await wpApi.initialize();
 
  try {
    console.log('=== WordPress CRUD Operations ===\n');
 
   
    console.log('1. Creating a new post...');
    const newPost: PostData = {
      title: 'Test Post from Playwright API',
      content: '<p>This is a test post content created via WordPress REST API.</p>',
      status: 'draft',
      excerpt: 'Test excerpt for the post',
      categories: [1],
      tags: [1, 2] 
    };
 
    const createResponse = await wpApi.createPost(newPost);
    if (createResponse.ok()) {
      const createdPost = await createResponse.json();
      const postId = createdPost.id;
      console.log(`✓ Post created successfully! ID: ${postId}`);
      console.log(`Post URL: ${createdPost.link}\n`);
 
    
      console.log('2. Retrieving the created post...');
      const getResponse = await wpApi.getPost(postId);
      if (getResponse.ok()) {
        const retrievedPost = await getResponse.json();
        console.log(`✓ Post retrieved! Title: ${retrievedPost.title.rendered}\n`);
      }
 
      
console.log('3. Updating the post...');
const updateData: Partial<PostData> = {
  title: 'Updated Post Title',
  content: '<p>Updated content with more details.</p>',
  status: 'publish'
};

const updateResponse = await wpApi.updatePost(postId, updateData);
if (updateResponse.ok()) {
  console.log('✓ Post updated successfully!\n');
}
 
      
      console.log('4. Retrieving all posts...');
      const allPostsResponse = await wpApi.getAllPosts({
        per_page: 5,
        page: 1,
        status: 'publish'
      });
 
      if (allPostsResponse.ok()) {
        const allPosts = await allPostsResponse.json();
        console.log(`✓ Retrieved ${allPosts.length} posts`);
        allPosts.forEach((post: any, index: number) => {
          console.log(`${index + 1}. ${post.title.rendered} (ID: ${post.id})`);
        });
        console.log();
      }
 
     
      console.log('5. Deleting the post...');
      const deleteResponse = await wpApi.deletePost(postId);
      if (deleteResponse.ok()) {
        console.log('✓ Post moved to trash successfully!');

        // await wpApi.permanentlyDeletePost(postId);
        // console.log('✓ Post permanently deleted!');
      }
 
    } else {
      const error = await createResponse.text();
      console.error('✗ Error creating post:', error);
    }
 
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    await wpApi.cleanup();
    console.log('\n=== Operations completed ===');
  }
}
 

runCRUDExample().catch(console.error);