
import { useState, useEffect, useRef } from 'react';
import { fetchUsers, fetchPostsByUser, fetchCommentsByPost } from '../services/api';
import { Post, User } from '../types';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  // Use a ref to track the polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch all posts and update state
  const fetchPosts = async () => {
    try {
      setIsPolling(true);
      
      // Fetch all users
      const allUsers = await fetchUsers();
      
      // Create a map of users for quick lookup
      const userMap: Record<string, User> = {};
      allUsers.forEach(user => {
        userMap[user.id] = user;
      });
      
      // Store users in state
      setUsers(userMap);
      
      // Fetch posts for each user
      const postsPromises = allUsers.map(async user => {
        const userPosts = await fetchPostsByUser(user.id);
        
        // Fetch comment counts for each post
        const postsWithComments = await Promise.all(
          userPosts.map(async post => {
            const comments = await fetchCommentsByPost(post.id);
            return {
              ...post,
              commentCount: comments.length
            };
          })
        );
        
        return postsWithComments;
      });
      
      // Wait for all promises to resolve
      const postsArrays = await Promise.all(postsPromises);
      
      // Flatten the arrays of posts
      let allPosts = postsArrays.flat();
      
      // Sort posts by creation date (newest first)
      allPosts = allPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(allPosts);
      setLoading(false);
      setIsPolling(false);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      setLoading(false);
      setIsPolling(false);
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPosts();
    
    // Set up polling every 60 seconds for real-time updates
    // Using a longer interval to reduce API calls while maintaining a good user experience
    pollingIntervalRef.current = setInterval(fetchPosts, 60000);
    
    // Clean up interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleManualRefresh = () => {
    if (!isPolling) {
      fetchPosts();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Latest Posts</h2>
          <p className="text-gray-600">
            Real-time feed of the newest posts
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isPolling}
          className={`px-4 py-2 rounded-lg bg-brand-blue text-white font-medium ${
            isPolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          {isPolling ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            user={users[post.userId]}
          />
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
