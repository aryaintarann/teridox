import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center',
        isUser ? 'bg-primary text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-primary'
      )}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        isUser
          ? 'bg-primary text-white rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'
      )}>
        {content}
      </div>
    </div>
  )
}
