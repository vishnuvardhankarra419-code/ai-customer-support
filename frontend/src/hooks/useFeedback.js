import { useState, useCallback } from 'react'
import { feedbackService } from '../services/feedbackService'
import toast from 'react-hot-toast'

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true)
    try {
      const [listRes, avgRes] = await Promise.all([
        feedbackService.getAll(),
        feedbackService.getAverageRating()
      ])
      setFeedbacks(listRes.data)
      setAvgRating(avgRes.data)
    } catch (err) {
      toast.error('Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitFeedback = async (data) => {
    try {
      await feedbackService.submit(data)
      toast.success('Thank you for your feedback!')
    } catch (err) {
      toast.error('Failed to submit feedback')
      throw err
    }
  }

  return { feedbacks, avgRating, isLoading, fetchFeedbacks, submitFeedback }
}
