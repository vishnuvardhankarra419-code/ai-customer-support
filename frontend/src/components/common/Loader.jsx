export default function Loader({ fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-brand-400 rounded-full animate-bounce-dots"></div>
        <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce-dots animate-delay-100"></div>
        <div className="w-3 h-3 bg-accent-purple rounded-full animate-bounce-dots animate-delay-200"></div>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        {content}
      </div>
    )
  }

  return <div className="p-4 flex justify-center w-full">{content}</div>
}
