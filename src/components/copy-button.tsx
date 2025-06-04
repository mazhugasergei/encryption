"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/utils"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { HTMLAttributes, useEffect, useState } from "react"

interface Props {
	textToCopy: string
}

export const CopyButton = ({
	textToCopy,
	className,
	children,
	...props
}: Props & HTMLAttributes<HTMLButtonElement>) => {
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => {
				setCopied(false)
			}, 1000)
			return () => clearTimeout(timer)
		}
	}, [copied])

	const handleCopy = () => {
		navigator.clipboard.writeText(textToCopy)
		setCopied(true)
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			onClick={handleCopy}
			className={cn("bg-background", className)}
			{...props}
		>
			{!children && (copied ? <CheckIcon /> : <ClipboardIcon />)}
			{children}
		</Button>
	)
}
