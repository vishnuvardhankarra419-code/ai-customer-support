import { useState, useCallback } from 'react'
import { faqService } from '../services/faqService'
import toast from 'react-hot-toast'

export const useFaq = () => {
  const [faqs, setFaqs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchActiveFaqs = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await faqService.getActiveFaqs()
      setFaqs(res.data)
    } catch (err) {
      toast.error('Failed to load FAQs')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAllFaqs = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await faqService.getAllFaqs()
      setFaqs(res.data)
    } catch (err) {
      toast.error('Failed to load FAQs')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createFaq = async (data) => {
    try {
      await faqService.createFaq(data)
      toast.success('FAQ created')
      await fetchAllFaqs()
    } catch (err) {
      toast.error('Failed to create FAQ')
      throw err
    }
  }

  const updateFaq = async (id, data) => {
    try {
      await faqService.updateFaq(id, data)
      toast.success('FAQ updated')
      await fetchAllFaqs()
    } catch (err) {
      toast.error('Failed to update FAQ')
      throw err
    }
  }

  const deleteFaq = async (id) => {
    try {
      await faqService.deleteFaq(id)
      toast.success('FAQ deleted')
      await fetchAllFaqs()
    } catch (err) {
      toast.error('Failed to delete FAQ')
      throw err
    }
  }

  return { faqs, isLoading, fetchActiveFaqs, fetchAllFaqs, createFaq, updateFaq, deleteFaq }
}
