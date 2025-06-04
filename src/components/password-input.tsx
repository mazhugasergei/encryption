"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { ComponentProps, useState } from "react"

export const PasswordInput = ({ className, value, disabled, ...props }: ComponentProps<"input">) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				value={value}
				disabled={disabled}
				className={cn("pr-11", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
				onClick={() => setShowPassword((prev) => !prev)}
				disabled={disabled}
			>
				{showPassword && <EyeIcon className="h-4 w-4" aria-hidden="true" />}
				{!showPassword && <EyeOffIcon className="h-4 w-4" aria-hidden="true" />}
			</Button>
		</div>
	)
}
