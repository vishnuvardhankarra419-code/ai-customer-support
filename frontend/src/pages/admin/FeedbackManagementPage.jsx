import { useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { useFeedback } from '../../hooks/useFeedback'
import Loader from '../../components/common/Loader'
import { FiStar } from 'react-icons/fi'

export default function FeedbackManagementPage() {
  const { feedbacks, isLoading, fetchFeedbacks } = useFeedback()

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Customer Feedback</h1>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid gap-4">
                {feedbacks.map(feedback => (
                  <div key={feedback.id} className="glass p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-medium">{feedback.user?.name || 'Anonymous User'}</div>
                        <div className="text-xs text-dark-400">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-1 text-accent-amber">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FiStar key={star} className={star <= feedback.rating ? 'fill-current' : 'text-dark-600'} />
                        ))}
                      </div>
                    </div>
                    {feedback.comment && (
                      <div className="p-4 bg-dark-900 rounded-xl text-dark-200 text-sm">
                        "{feedback.comment}"
                      </div>
                    )}
                  </div>
                ))}

                {feedbacks.length === 0 && (
                  <div className="text-center p-8 text-dark-400 glass">
                    No feedback received yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

