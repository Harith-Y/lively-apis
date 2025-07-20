'use client'
import { ErrorMessage } from '@/components/ui/error-message'
 
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorMessage message={error.message} onRetry={reset} />
} 