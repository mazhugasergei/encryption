import { cn } from "@/utils"
import { HTMLAttributes } from "react"

export const Wrapper = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={cn("mx-auto w-full max-w-xl", className)} {...props}>
			{children}
		</div>
	)
}
