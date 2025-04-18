
import { useState, useEffect } from 'react';
import { fetchAllPostsWithComments, fetchUsers } from '../services/api';
import { Post, User } from '../types';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all posts with comment counts
        const allPosts = await fetchAllPostsWithComments();
        
        // Find the maximum comment count
        const maxCommentCount = Math.max(...allPosts.map(post => post.commentCount || 0));
        
        // Filter posts with the maximum comment count
        const trending = allPosts.filter(post => post.commentCount === maxCommentCount);
        
        // Fetch all users and create a map for quick lookup
        const allUsers = await fetchUsers();
        const userMap: Record<string, User> = {};
        allUsers.forEach(user => {
          userMap[user.id] = user;
        });
        
        setUsers(userMap);
        setTrendingPosts(trending);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch trending posts. Please try again later.');
        setLoading(false);
        console.error('Error fetching trending posts:', err);
      }
    };
    
    fetchTrendingPosts();
  }, []);

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
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Trending Posts</h2>
        <p className="text-gray-600">
          Posts with the most comments and engagement
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {trendingPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            user={users[post.userId]}
            isTrending={true}
          />
        ))}
        
        {trendingPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No trending posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPosts;
