import { clsx, type ClassValue } from "clsx"
import type { StaticImageData } from "next/image"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import { parseError } from "./error"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export async function imageToBase64(image: StaticImageData): Promise<string> {
	const res = await fetch(image.src)
	const blob = await res.blob()

	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}

export const handleError = (error: unknown) => {
	console.error(error)
	toast.error("Something went wrong", {
		description: <p className="text-foreground">{parseError(error)}</p>,
		closeButton: true,
		position: "top-center",
	})
}
