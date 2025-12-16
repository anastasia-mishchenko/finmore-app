import { APIRequestContext, APIResponse, request } from '@playwright/test';
 
export interface PostData {
  title: string;
  content: string;
  date?: string;
  status?: 'publish' | 'draft' | 'pending' | 'private';
  excerpt?: string;
  categories?: number[];
  tags?: number[];
}
 
export class WordPressAPI {
  private requestContext!: APIRequestContext;
  private baseURL: string;
  private authHeader: string;
 
  constructor(baseURL: string, username: string, password: string) {
    this.baseURL = baseURL;
    this.authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  }
 
  async initialize(): Promise<void> {
    this.requestContext = await request.newContext({
      timeout: 30000, // 30 seconds timeout for API requests
      extraHTTPHeaders: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
      },
    });
  }
 
  async cleanup(): Promise<void> {
    await this.requestContext.dispose();
  }
 
   async createPost(postData: PostData): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/wp/v2/posts`;
      console.log(`Creating post at: ${url}`);
      
      const response = await this.requestContext.post(url, {
        data: {
          title: postData.title,
          content: postData.content,
          status: postData.status || 'draft',
          excerpt: postData.excerpt || '',
          categories: postData.categories || [],
          tags: postData.tags || []
        }
      });

      console.log('Create Post Status:', response.status());
      console.log('Create Post Request URL:', url);
      console.log('Create Post Response URL:', response.url());
      
      if (!response.ok()) {
        const contentType = response.headers()['content-type'] || '';
        const errorText = await response.text();
        console.error('Create Post Error Status:', response.status());
        console.error('Create Post Content-Type:', contentType);
        console.error('Create Post Error Body (first 1000 chars):', errorText.substring(0, 1000));
        
        if (response.status() === 404) {
          throw new Error(`WordPress REST API endpoint not found. The endpoint ${url} returned 404 (redirected to ${response.url()}). This usually means:\n1. WordPress REST API is disabled\n2. The endpoint path is incorrect\n3. Permalinks need to be flushed in WordPress admin\n4. A security plugin is blocking REST API access\n5. Server rewrite rules are incorrectly redirecting /wp-json/wp/v2/posts to /wp/v2/posts`);
        }
      }
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
 
  async changePostStatus(postId: number, status: 'publish' | 'draft' | 'pending' | 'private'): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/wp/v2/posts/${postId}`;
      const response = await this.requestContext.post(url, {
        data: { status: status }
      });
      console.log('Change Post Status Status:', response.status());
      console.log('Change Post Status Response URL:', response.url());
      if (!response.ok()) {
        console.error('Change Post Status Error:', await response.text());
      }
      return response;
    }
    catch (error) {
      console.error('Error changing post status:', error);
      throw error;
    }
  }

  async getPost(postId: number): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/wp/v2/posts/${postId}`;
      console.log(`Getting post at: ${url}`);
      const response = await this.requestContext.get(url);
      console.log('Get Post Status:', response.status());
      console.log('Get Post Response URL:', response.url());
      if (!response.ok()) {
        const contentType = response.headers()['content-type'] || '';
        const errorText = await response.text();
        console.error('Get Post Error Status:', response.status());
        console.error('Get Post Content-Type:', contentType);
        console.error('Get Post Error Body (first 1000 chars):', errorText.substring(0, 1000));
        
        if (response.status() === 404) {
          throw new Error(`WordPress REST API endpoint not found. The endpoint ${url} returned 404. This usually means:\n1. WordPress REST API is disabled\n2. The endpoint path is incorrect\n3. Permalinks need to be flushed in WordPress admin\n4. A security plugin is blocking REST API access`);
        }
      }
      return response;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }

  async getAllPosts(params?: {
    per_page?: number;
    page?: number;
    status?: string;
    search?: string;
  }): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/wp/v2/posts`;
      const response = await this.requestContext.get(url, {
        params: params || {}
      });
      console.log('Get All Posts Status:', response.status());
      console.log('Total Posts:', response.headers()['x-wp-total']);
      return response;
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }
 
 
  async updatePost(postId: number, postData: Partial<PostData>): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/wp/v2/posts/${postId}`;
      const response = await this.requestContext.post(url, {
        data: postData
      });
      console.log('Update Post Status:', response.status());
      console.log('Update Post Response URL:', response.url());
      if (!response.ok()) {
        console.error('Update Post Error:', await response.text());
      }
      return response;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }
 
 
  async deletePost(postId: number, force: boolean = false): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/wp/v2/posts/${postId}`;
      const response = await this.requestContext.delete(url, {
        params: { force: force.toString() }
      });
      console.log('Delete Post Status:', response.status());
      if (!response.ok()) {
        console.error('Delete Post Error:', await response.text());
      }
      return response;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
 
  // Permanently delete post (true delete)
  async permanentlyDeletePost(postId: number): Promise<APIResponse> {
    try {
      // Check if post exists and its status
      const getResponse = await this.getPost(postId);
      
      if (getResponse.ok()) {
        const post = await getResponse.json();
        // If post is not in trash, move it to trash first
        if (post.status !== 'trash') {
          await this.deletePost(postId, false);
        }
      } else {
        // If post doesn't exist, try to delete anyway (might already be deleted)
        // This handles edge cases
      }
      
      // Now permanently delete (force delete)
      const response = await this.deletePost(postId, true);
      console.log('Permanently Delete Post Status:', response.status());
      return response;
    } catch (error) {
      console.error('Error permanently deleting post:', error);
      throw error;
    }
  }
}