
import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-12rem)]">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Social Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
