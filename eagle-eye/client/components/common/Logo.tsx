import { cn } from '@/lib/utils'
import { ScanEye } from 'lucide-react'
import React from 'react'

const Logo = ({ className }: { className?: string }) => {
  return (
    <ScanEye className={cn('size-6', className)} />
  )
}

export default Logo