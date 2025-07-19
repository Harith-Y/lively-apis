import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message: string
  suggestion?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ 
  title = "Something went wrong", 
  message, 
  suggestion,
  onRetry,
  className 
}: ErrorMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      
      {suggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md">
          <p className="text-blue-800 text-sm">
            <strong>Suggestion:</strong> {suggestion}
          </p>
        </div>
      )}
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}