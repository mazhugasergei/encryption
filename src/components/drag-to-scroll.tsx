import { cn } from "@/utils"
import { HTMLAttributes, useEffect, useRef } from "react"

export const DragToScroll = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		let isDown = false
		let startX = 0
		let startY = 0
		let scrollLeft = 0
		let scrollTop = 0

		const onMouseDown = (e: MouseEvent) => {
			isDown = true
			el.style.cursor = "grabbing"
			startX = e.clientX
			startY = e.clientY
			scrollLeft = el.scrollLeft
			scrollTop = el.scrollTop
		}

		const onMouseLeave = () => {
			isDown = false
			el.style.cursor = "grab"
		}

		const onMouseUp = () => {
			isDown = false
			el.style.cursor = "grab"
		}

		const onMouseMove = (e: MouseEvent) => {
			if (!isDown) return
			e.preventDefault()
			const walkX = e.clientX - startX
			const walkY = e.clientY - startY
			el.scrollLeft = scrollLeft - walkX
			el.scrollTop = scrollTop - walkY
		}

		el.addEventListener("mousedown", onMouseDown)
		el.addEventListener("mouseleave", onMouseLeave)
		el.addEventListener("mouseup", onMouseUp)
		el.addEventListener("mousemove", onMouseMove)

		return () => {
			el.removeEventListener("mousedown", onMouseDown)
			el.removeEventListener("mouseleave", onMouseLeave)
			el.removeEventListener("mouseup", onMouseUp)
			el.removeEventListener("mousemove", onMouseMove)
		}
	}, [])

	return (
		<div ref={ref} className={cn("scrollbar-none cursor-grab overflow-auto", className)} {...props}>
			{children}
		</div>
	)
}
