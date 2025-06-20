import React from 'react';
import { CheckCircle, ArrowLeft, Home, MessageCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function FeedbackConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation Container */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Feedback Sent Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
            Thank you for taking the time to share your thoughts with us. Your feedback is valuable and helps us improve our service.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <MessageCircle className="w-6 h-6 mr-3" />
              What Happens Next?
            </h2>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review Process</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our team will carefully review your feedback within 1-2 business days.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Follow-up</h3>
                  <p className="text-gray-600 dark:text-gray-300">If your feedback requires a response, we'll get back to you via email.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Implementation</h3>
                  <p className="text-gray-600 dark:text-gray-300">Valid suggestions and improvements will be considered for future updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={route('feedback.create')}
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Send More Feedback
          </Link>

          <Link
            href={route('dashboard')} // Change this to your main page route
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              🎉 Your feedback reference ID: <span className="font-mono">#FB-{Date.now().toString().slice(-6)}</span>
            </p>
            <p className="text-blue-600 dark:text-blue-300 text-sm mt-2">
              Save this ID for future reference if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}