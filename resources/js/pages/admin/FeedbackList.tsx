import React from 'react';
import AppLayout from '@/layouts/app-layout';

type Feedback = {
  id: number;
  subject: string;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

interface Props {
  feedback?: Feedback[];
}

const FeedbackList: React.FC<Props> = ({ feedback = [] }) => {
  return (
    <AppLayout breadcrumbs={[{ title: 'User Feedback', href: '/admin/feedback' }]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">User Feedback</h1>
        {feedback.length === 0 ? (
          <div className="text-gray-500">No feedback yet.</div>
        ) : (
          <div className="space-y-4">
            {feedback.map(fb => (
              <div
                key={fb.id}
                className="border rounded-lg p-4 bg-white shadow-sm max-w-4xl"
              >
                <div className="font-semibold text-lg">{fb.subject}</div>
                <div className="text-gray-700 mb-2 break-words whitespace-pre-line">
                  {fb.content}
                </div>
                <div className="text-sm text-gray-500">
                  From: {fb.user.name} ({fb.user.email})<br />
                  <span className="italic">{new Date(fb.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FeedbackList;