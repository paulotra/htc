interface TrainingNavProps {
	name: string;
	certActive: boolean;
	onShowCertificate: () => void;
}

export default function TrainingNav({
	name,
	certActive,
	onShowCertificate,
}: TrainingNavProps) {
	return (
		<div className="md:flex items-center gap-3 px-6 md:px-8 py-5 border-b border-[rgba(66,58,46,0.59)] text-center md:text-left md:bg-[#000] relative z-10">
			<p className="flex-1 text-2xl md:text-xl font-light text-white">
				Welcome back, <span className="font-medium">{name}</span>
			</p>

			<button
				onClick={certActive ? onShowCertificate : undefined}
				className={`flex items-center mt-4 md:mt-0 w-full md:w-auto justify-center md:justify-start gap-[10px] px-4 py-[10px] border rounded-[4px] shrink-0 transition-opacity ${
					certActive
						? "border-[#e5ce78] text-gold cursor-pointer opacity-100"
						: "border-[rgba(66,58,46,0.5)] text-[#9a9a9a] cursor-default opacity-50"
				}`}
			>
				<svg
					width="19"
					height="19"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<circle cx="12" cy="9" r="6" />
					<path
						d="M9 21l3-1.5L15 21v-6.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<span className="text-xs tracking-[1.2px] uppercase font-normal whitespace-nowrap">
					{certActive ? "View Certificate" : "Certificate — Locked"}
				</span>
			</button>
		</div>
	);
}
