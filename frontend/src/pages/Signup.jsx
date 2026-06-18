import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Send the new user data to your Render backend
      const response = await fetch('https://expensetracker-api-nezd.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      // 2. Check if the database rejected it (e.g., email already exists)
      if (!response.ok) {
        alert("Signup failed: " + (data.error || data.message || "Please try again"));
        return;
      }

      // 3. Success! Let the user know and send them to the Login page
      alert("Account created successfully! You can now log in.");
      navigate('/'); 

    } catch (err) {
      console.error("Signup Error:", err);
      alert("Could not connect to the server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-2">Join Smart Expense Tracker today.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition duration-300 shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        {/* --- Social Login Section --- */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {/* Google Button */}
            <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>

            {/* Apple Button */}
            <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.365 21.435c-1.32.96-2.625.96-3.87 0-1.74-1.335-4.14-1.335-5.88 0-1.89 1.455-3.66.75-4.5-1.41-1.35-3.48-1.545-7.5-.135-10.425 1.29-2.67 3.555-4.26 6.315-4.305 1.77-.045 3.345.975 4.395.975 1.05 0 2.94-1.2 5.055-.99 2.13.21 4.095 1.455 5.175 3.33-4.56 2.415-3.825 8.595.66 10.365-1.02 2.52-2.73 4.98-5.07 6.42-1.32.81-2.4 1.185-3.195 1.185-.795 0-1.635-.375-2.82-1.14zM15.42 6.57c.75-1.02 1.26-2.43 1.125-3.84-1.365.075-2.91.885-3.735 1.95-.72.885-1.29 2.31-1.125 3.705 1.47.09 2.94-.75 3.735-1.815z" />
              </svg>
            </button>

            {/* Facebook Button */}
            <button className="flex justify-center items-center py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <Link to="/" className="text-indigo-600 font-bold hover:underline transition-all">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;