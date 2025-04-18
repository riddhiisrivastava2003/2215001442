
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Users, TrendingUp } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-brand-softBlue text-brand-purple font-medium' : 'hover:bg-gray-100';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-lg mr-2">
                <BarChart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                Social Insight
              </h1>
            </Link>
          </div>
          
          <nav className="flex space-x-1 bg-gray-50 p-1 rounded-lg">
            <Link 
              to="/"
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${isActive('/')}`}
            >
              <Users className="h-4 w-4" />
              <span>Top Users</span>
            </Link>
            <Link 
              to="/trending"
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${isActive('/trending')}`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </Link>
            <Link 
              to="/feed"
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${isActive('/feed')}`}
            >
              <BarChart className="h-4 w-4" />
              <span>Feed</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
