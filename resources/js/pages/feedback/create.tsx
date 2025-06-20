import { useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, FileText, CheckCircle, X } from 'lucide-react';

export default function Create() {
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    subject: '',
    content: '',
  });
  
  const [showNotification, setShowNotification] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('feedback.store'));
  }

  // Show notification when form submission is successful
  useEffect(() => {
    if (wasSuccessful) {
      setShowNotification(true);
      // Auto-hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [wasSuccessful]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Feedback Sent!</p>
              <p className="text-sm text-green-100">Thank you for your feedback.</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-green-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Help us improve by sharing your thoughts, suggestions, or concerns with our team.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FileText className="w-6 h-6 mr-3" />
              Feedback Form
            </h2>
          </div>

          <div className="p-8 space-y-8">
            {/* Subject Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.subject}
                  onChange={e => setData('subject', e.target.value)}
                  placeholder="What's this feedback about?"
                  className={`w-full px-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 ${
                    errors.subject 
                      ? 'border-red-300 dark:border-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                />
                {errors.subject && (
                  <div className="absolute -bottom-6 left-0 text-red-500 dark:text-red-400 text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mr-2"></div>
                    {errors.subject}
                  </div>
                )}
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-2 mt-8">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <MessageCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Your Feedback
              </label>
              <div className="relative">
                <textarea
                  value={data.content}
                  onChange={e => setData('content', e.target.value)}
                  placeholder="Share your detailed feedback, suggestions, or concerns..."
                  rows={6}
                  className={`w-full px-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 resize-none ${
                    errors.content 
                      ? 'border-red-300 dark:border-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                />
                {errors.content && (
                  <div className="absolute -bottom-6 left-0 text-red-500 dark:text-red-400 text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mr-2"></div>
                    {errors.content}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={processing}
                onClick={submit}
                className={`w-full px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 ${
                  processing 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-center">
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Send Feedback
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your feedback is valuable to us and helps improve our service. Thank you for taking the time to share your thoughts!
          </p>
        </div>
      </div>
    </div>
  );
}