// apps/web/src/components/ui/copy-button.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Copy, Check } from "lucide-react"

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  copiedLabel?: string
  tooltip?: string
}

export function CopyButton({
  value,
  copiedLabel = "Copied",
  tooltip = "Copy to clipboard",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // swallow errors silently
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={cn(
            "h-6 w-6 rounded-md text-muted-foreground hover:text-foreground",
            className
          )}
          {...props}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? copiedLabel : tooltip}</TooltipContent>
    </Tooltip>
  )
}