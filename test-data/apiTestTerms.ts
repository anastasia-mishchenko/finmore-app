export const apiTestTerms = {
  // Configuration
  baseUrl: 'https://dev.emeli.in.ua/wp-json',
  defaultUsername: 'admin',
  defaultPassword: 'Engineer_123',

  // Post status values
  status: {
    draft: 'draft',
    publish: 'publish',
    private: 'private',
    future: 'future',
    trash: 'trash',
  },

  // Test post data
  postData: {
    initialTitle: 'Test Post from Playwright Test',
    initialContent: '<p>Test content for Playwright API test.</p>',
    initialExcerpt: 'Test excerpt',
    updatedTitle: 'Updated Title from Test',
    emptyTitle: '',
    emptyContent: '',
  },

  // Error responses
  errorResponses: {
    emptyContent: {
      code: 'empty_content',
      message: 'Content, title, and excerpt are empty.',
      status: 400,
    },
    invalidParam: {
      code: 'rest_invalid_param',
      message: 'Invalid parameter(s): status',
      status: 400,
      statusParamMessage: 'status is not one of publish, future, draft, pending, private, auto-draft, wc-pending, wc-processing, wc-on-hold, wc-completed, wc-cancelled, wc-refunded, wc-failed, and wc-checkout-draft.',
    },
    invalidPostId: {
      code: 'rest_post_invalid_id',
      message: 'Invalid post ID.',
      status: 404,
    },
  },

  // Test constants
  testConstants: {
    nonExistingPostId: 999999,
    defaultCategoryId: 1,
    postsPerPage: 10,
    daysInFuture: 2,
  },
} as const;
