import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessAnimationProps {
  message?: string
  className?: string
  onComplete?: () => void
}

export function SuccessAnimation({ message = "Success!", className, onComplete }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      onAnimationComplete={onComplete}
      className={cn("flex flex-col items-center justify-center p-8", className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
      >
        <CheckCircle className="w-8 h-8 text-green-600" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg font-medium text-gray-900 text-center"
      >
        {message}
      </motion.p>
    </motion.div>
  )
}