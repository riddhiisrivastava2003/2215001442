import { User, Post, Comment, UsersResponse, PostsResponse, CommentsResponse } from '../types';
import { dummyUsers, dummyPosts, dummyComments } from '../utils/dummyData';

// Server API URL
const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Cache to minimize API calls
const cache = {
  users: null as User[] | null,
  posts: {} as Record<string, Post[]>,
  comments: {} as Record<string, Comment[]>,
  timestamp: {} as Record<string, number>
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Generate a random image URL for users and posts
export const getRandomUserImage = (): string => {
  const index = Math.floor(Math.random() * 10) + 1;
  return `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${index}.jpg`;
};

export const getRandomPostImage = (): string => {
  return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400`;
};

// Fetch all users with caching
export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Check if we have cached users and if they're still valid
    const now = Date.now();
    if (cache.users && cache.timestamp['users'] && (now - cache.timestamp['users'] < CACHE_EXPIRATION)) {
      return cache.users;
    }
    
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data: UsersResponse = await response.json();
    
    // Convert the user object to an array with proper structure
    const users = Object.entries(data.users).map(([id, name]) => ({
      id,
      name,
      imageUrl: getRandomUserImage()
    }));
    
    // Cache the users
    cache.users = users;
    cache.timestamp['users'] = now;
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    console.log('Falling back to dummy data');
    return dummyUsers;
  }
};

// Fetch posts by user ID
export const fetchPostsByUser = async (userId: string): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`);
    }
    const data: PostsResponse = await response.json();
    
    // Add random image URLs to posts
    return data.posts.map(post => ({
      ...post,
      imageUrl: getRandomPostImage()
    }));
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    console.log('Falling back to dummy data');
    return dummyPosts.filter(post => post.userId === userId);
  }
};

// Fetch comments for a post with caching
export const fetchCommentsByPost = async (postId: string): Promise<Comment[]> => {
  try {
    // Check if we have cached comments for this post and if they're still valid
    const now = Date.now();
    const cacheKey = `comments_${postId}`;
    if (cache.comments[postId] && cache.timestamp[cacheKey] && (now - cache.timestamp[cacheKey] < CACHE_EXPIRATION)) {
      return cache.comments[postId];
    }
    
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${postId}`);
    }
    const data: CommentsResponse = await response.json();
    
    // Cache the comments
    cache.comments[postId] = data.comments;
    cache.timestamp[cacheKey] = now;
    
    return data.comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    console.log('Falling back to dummy data');
    return dummyComments.filter(comment => comment.postId === postId);
  }
};

// Fetch all posts with their comment counts
export const fetchAllPostsWithComments = async (): Promise<Post[]> => {
  try {
    // First fetch all users
    const users = await fetchUsers();
    
    // Then fetch posts for each user
    const postsPromises = users.map(user => fetchPostsByUser(user.id));
    const postsArrays = await Promise.all(postsPromises);
    
    // Flatten the arrays of posts
    const allPosts = postsArrays.flat();
    
    // Fetch comment counts for each post
    const postsWithComments = await Promise.all(
      allPosts.map(async post => {
        const comments = await fetchCommentsByPost(post.id);
        return {
          ...post,
          commentCount: comments.length
        };
      })
    );
    
    return postsWithComments;
  } catch (error) {
    console.error('Error fetching all posts with comments:', error);
    return [];
  }
};
