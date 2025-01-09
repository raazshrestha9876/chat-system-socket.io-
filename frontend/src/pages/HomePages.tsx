import { MessageCircle, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePages = () => {

    const token = localStorage.getItem('token');
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ChatApp</h1>
          <div className="space-x-4">
            <Link to="/auth" className="px-4 py-2 text-gray-600 hover:text-blue-600">Login</Link>
            <Link to={token ? "/chat" : "/auth"} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with anyone, <span className="text-blue-600">anywhere</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience seamless communication with our modern chat platform. 
            Connect with friends, family, and colleagues instantly.
          </p>
          <Link to={token ? "/chat": "/auth"} className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700">
            Start Chatting Now
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <MessageCircle className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Instant messaging with real-time updates</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">End-to-end encryption for your privacy</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p className="text-gray-600">Lightning-fast message delivery</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePages;