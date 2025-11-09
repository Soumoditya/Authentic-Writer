
import React from 'react';
import { CheckCircleIcon } from './Icons';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Authentic Writer</h1>
            <p className="mt-2 text-sm text-gray-600">Your Words, Verified.</p>
        </div>
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This platform uses simulated Government ID verification to ensure all users are real and all content is 100% human-authored.
              </p>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={onLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Login with Verified ID
          </button>
        </div>
        <p className="text-xs text-center text-gray-500">
          By logging in, you agree to our Terms of Service and Privacy Policy. All your work is timestamped and cryptographically signed.
        </p>
      </div>
    </div>
  );
};
