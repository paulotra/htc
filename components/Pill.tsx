interface PillProps {
	children: React.ReactNode;
	className?: string;
}

export default function Pill({ children, className = "" }: PillProps) {
	return (
		<div
			className={`inline-flex items-center justify-center border border-white/[0.12] rounded-[30px] px-4 py-2 text-xs font-normal tracking-[0.125rem] uppercase text-white whitespace-nowrap ${className}`}
		>
			{children}
		</div>
	);
}
