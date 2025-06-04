import { cn } from "@/utils"
import { HTMLAttributes } from "react"

export const Container = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={cn("rounded-md border", className)} {...props}>
			{children}
		</div>
	)
}
