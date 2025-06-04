import { cn } from "@/utils"
import { CopyButton } from "./copy-button"
import { DragToScroll } from "./drag-to-scroll"

export const DragToScrollString = ({ data, showCopyButton = false }: { data: string; showCopyButton?: boolean }) => {
	return (
		<div className="grid grid-cols-[1fr_auto]">
			<DragToScroll
				className={cn(
					"bg-secondary relative flex h-full min-h-9 items-center justify-center rounded-md border",
					showCopyButton && "border-r-none rounded-r-none"
				)}
			>
				<p className="absolute inset-0 flex items-center">
					<span className="px-3 py-2 font-mono select-none">{data}</span>
				</p>
			</DragToScroll>
			{showCopyButton && <CopyButton textToCopy={data} className="h-full rounded-l-none" />}
		</div>
	)
}
