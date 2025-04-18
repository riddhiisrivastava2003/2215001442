
import { User } from '../types';
import { MessageSquare, Trophy } from 'lucide-react';

interface UserCardProps {
  user: User;
  rank: number;
  commentCount: number;
}

const UserCard = ({ user, rank, commentCount }: UserCardProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400';
      case 2:
        return 'bg-gray-300';
      case 3:
        return 'bg-amber-600';
      default:
        return 'bg-brand-purple';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      <div className="relative p-6">
        <div className="absolute -top-1 -right-1">
          <div className={`${getRankColor(rank)} text-white w-12 h-12 rounded-full flex items-center justify-center`}>
            <Trophy className="w-6 h-6" />
            <span className="absolute -bottom-6 text-sm font-bold">#{rank}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <img 
            src={user.imageUrl} 
            alt={user.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-brand-softBlue" 
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{user.name}</h3>
            <div className="flex items-center text-brand-purple">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="font-semibold">{commentCount}</span>
              <span className="text-gray-600 ml-1.5 text-sm">comments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-brand-softBlue to-brand-purple h-1" />
    </div>
  );
};

export default UserCard;
