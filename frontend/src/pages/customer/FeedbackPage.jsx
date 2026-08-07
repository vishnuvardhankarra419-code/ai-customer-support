import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { useFeedback } from '../../hooks/useFeedback'
import { FiStar } from 'react-icons/fi'

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const { submitFeedback, isLoading } = useFeedback()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return
    await submitFeedback({ rating, comment })
    setRating(0)
    setComment('')
  }

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Leave Feedback</h1>
            <p className="text-dark-400 mb-8">Tell us about your experience with AI Support.</p>
            
            <div className="glass-strong p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-4 text-center">
                    How would you rate your experience?
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`p-2 transition-all ${
                          star <= (hoverRating || rating) 
                            ? 'text-accent-amber scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                            : 'text-dark-600 hover:text-dark-400'
                        }`}
                      >
                        <FiStar size={40} className={star <= (hoverRating || rating) ? 'fill-current' : ''} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Tell us what you liked or how we can improve..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

