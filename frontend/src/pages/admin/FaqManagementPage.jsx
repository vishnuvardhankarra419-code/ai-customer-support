import { useEffect, useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import { useFaq } from '../../hooks/useFaq'
import Loader from '../../components/common/Loader'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function FaqManagementPage() {
  const { faqs, isLoading, fetchAllFaqs, createFaq, updateFaq, deleteFaq } = useFaq()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentFaq, setCurrentFaq] = useState(null)
  
  const [formData, setFormData] = useState({
    question: '', answer: '', category: 'General', isActive: true
  })

  useEffect(() => {
    fetchAllFaqs()
  }, [fetchAllFaqs])

  const openModal = (faq = null) => {
    if (faq) {
      setCurrentFaq(faq)
      setFormData({ question: faq.question, answer: faq.answer, category: faq.category, isActive: faq.isActive })
    } else {
      setCurrentFaq(null)
      setFormData({ question: '', answer: '', category: 'General', isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentFaq) {
      await updateFaq(currentFaq.id, formData)
    } else {
      await createFaq(formData)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">FAQ Management</h1>
              <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
                <FiPlus /> Add FAQ
              </button>
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid gap-4">
                {faqs.map(faq => (
                  <div key={faq.id} className="glass p-6 group">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="badge bg-brand-500/20 text-brand-400">{faq.category}</span>
                          <span className={`badge ${faq.isActive ? 'bg-accent-teal/20 text-accent-teal' : 'bg-dark-600 text-dark-300'}`}>
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                        <p className="text-dark-300 text-sm whitespace-pre-wrap">{faq.answer}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(faq)} className="p-2 text-brand-400 hover:bg-brand-500/20 rounded-lg">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => deleteFaq(faq.id)} className="p-2 text-accent-rose hover:bg-accent-rose/20 rounded-lg">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {faqs.length === 0 && (
                  <div className="text-center p-8 text-dark-400 glass">
                    No FAQs found. Create one to get started.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-lg p-6 animate-slide-up">
            <h2 className="text-xl font-bold mb-6">{currentFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <textarea required rows={4} value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="input-field resize-none" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field" />
                </div>
                
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500/50" />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

