
import { useState, useEffect } from 'react';
import { fetchUsers, fetchPostsByUser, fetchCommentsByPost } from '../services/api';
import { User } from '../types';
import UserCard from '../components/UserCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface UserWithCommentCount extends User {
  commentCount: number;
}

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState<UserWithCommentCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch all users
        const users = await fetchUsers();
        
        // For each user, fetch their posts and calculate total comments
        const usersWithComments = await Promise.all(
          users.map(async (user) => {
            const posts = await fetchPostsByUser(user.id);
            
            // For each post, fetch comments
            const commentCountPromises = posts.map(async (post) => {
              const comments = await fetchCommentsByPost(post.id);
              return comments.length;
            });
            
            const commentCounts = await Promise.all(commentCountPromises);
            const totalComments = commentCounts.reduce((sum, count) => sum + count, 0);
            
            return {
              ...user,
              commentCount: totalComments
            };
          })
        );
        
        // Sort users by comment count (descending) and take top 5
        const sortedUsers = usersWithComments
          .sort((a, b) => b.commentCount - a.commentCount)
          .slice(0, 5);
        
        setTopUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch top users. Please try again later.');
        setLoading(false);
        console.error('Error fetching top users:', err);
      }
    };
    
    fetchTopUsers();
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
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Top Users</h2>
        <p className="text-gray-600">
          Users with the most engagement based on comment count
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {topUsers.map((user, index) => (
          <UserCard
            key={user.id}
            user={user}
            rank={index + 1}
            commentCount={user.commentCount}
          />
        ))}
      </div>
      
      {topUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No user data available</p>
        </div>
      )}
    </div>
  );
};

export default TopUsers;
