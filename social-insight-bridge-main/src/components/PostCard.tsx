
import { useState } from 'react';
import { Post, User } from '../types';
import { MessageSquare, ThumbsUp, Share2, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  user?: User;
  isTrending?: boolean;
}

const PostCard = ({ post, user, isTrending = false }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg ${isTrending ? 'border-2 border-brand-orange' : 'border border-gray-100'}`}>
      {isTrending && (
        <div className="bg-gradient-to-r from-brand-orange to-brand-purple text-white py-2 px-4 text-center font-semibold">
          🔥 Trending Post
        </div>
      )}
      
      <div className="p-6">
        {user && (
          <div className="flex items-center mb-4">
            <img 
              src={user.imageUrl} 
              alt={user.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-softBlue mr-4" 
            />
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{post.title}</h2>
        
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-64 object-cover rounded-lg mb-4" 
          />
        )}
        
        <div className={`${isExpanded ? '' : 'line-clamp-3'} text-gray-600 mb-4`}>
          {post.content}
        </div>
        
        {post.content.length > 180 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-brand-purple font-medium hover:text-brand-blue transition-colors mb-4"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button className="flex items-center text-gray-600 hover:text-brand-purple transition-colors">
              <ThumbsUp className="h-5 w-5 mr-1.5" />
              <span className="font-medium">Like</span>
            </button>
            <div className="flex items-center text-gray-600">
              <MessageSquare className="h-5 w-5 mr-1.5" />
              <span className="font-medium">{post.commentCount || 0}</span>
              <span className="ml-1">Comments</span>
            </div>
          </div>
          
          <button className="flex items-center text-gray-600 hover:text-brand-purple transition-colors">
            <Share2 className="h-5 w-5 mr-1.5" />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
