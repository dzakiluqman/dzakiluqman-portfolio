import React from 'react'

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-slate-700 border-t-indigo-500 animate-spin`}
      />
      {text && <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
