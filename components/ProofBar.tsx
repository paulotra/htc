import { Fragment } from "react";

interface ProofStat {
	value: string;
	label: string;
}

const stats: ProofStat[] = [
	{ value: "500+", label: "Trained" },
	{ value: "$25k", label: "Top Month" },
	{ value: "8wks", label: "To Results" },
];

export default function ProofBar() {
	return (
		<div
			data-gsap="stagger-parent"
			className="md:flex items-stretch justify-center max-w-[1000px] mt-0	 md:mt-[3.75rem] mx-auto px-4 pb-6"
		>
			{stats.map((stat, i) => (
				<Fragment key={stat.value}>
					{i > 0 && <div className="proof-divider" />}
					<div
						data-gsap="stagger-child"
						className="relative flex flex-col gap-1 items-center justify-center px-11 py-4 md:py-8 md:pb-10 rounded-[20px] flex-1"
					>
						<div className="font-serif gold-text text-4xl md:text-6xl leading-none text-center whitespace-nowrap">
							{stat.value}
						</div>
						<div className="text-xs font-light tracking-[0.125rem] uppercase text-white text-center whitespace-nowrap mt-1">
							{stat.label}
						</div>
					</div>
				</Fragment>
			))}
		</div>
	);
}
