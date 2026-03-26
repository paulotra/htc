interface CtaFeature {
	icon: string;
	label: string;
	detail: string;
}

interface CtaCardData {
	variant: "gold" | "silver";
	label: string;
	title: string;
	titleLine2: string;
	titleLine2Gold: boolean;
	description: string;
	features: CtaFeature[];
	ctaText: string;
	ctaHref: string;
	ctaIcon: string;
	scarcity?: string;
}

const cards: CtaCardData[] = [
	{
		variant: "gold",
		label: "I'm Ready Now",
		title: "Book Your",
		titleLine2: "HTC Mastery Call",
		titleLine2Gold: true,
		description:
			"No fluff. No pitch. Your exact path to $5K–$20K a month, built live on the call.",
		features: [
			{
				icon: "/images/figma/9aade471-d946-4303-bf2e-268ce39656ce.svg",
				label: "45 minutes",
				detail: "direct with Bruno",
			},
			{
				icon: "/images/figma/9aade471-d946-4303-bf2e-268ce39656ce.svg",
				label: "90-day plan",
				detail: "built live on the call",
			},
			{
				icon: "/images/figma/9aade471-d946-4303-bf2e-268ce39656ce.svg",
				label: "5 spots / day",
				detail: "limited access",
			},
		],
		ctaText: "Book your HTC mastery call",
		ctaHref: "/booking",
		ctaIcon:
			"/images/figma/ab357bbf-fa5c-4743-af89-87f90cfb66ba.svg",
		scarcity: "3 spots",
	},
	{
		variant: "silver",
		label: "Show Me First",
		title: "Free 5-Day",
		titleLine2: "Closer Training",
		titleLine2Gold: false,
		description:
			"Not sure yet? 5 days of real training. Understand the skill before you commit.",
		features: [
			{
				icon: "/images/figma/90688006-70b1-4791-b37d-d2ba8f113996.svg",
				label: "5 videos",
				detail: "one per day",
			},
			{
				icon: "/images/figma/90688006-70b1-4791-b37d-d2ba8f113996.svg",
				label: "Real framework",
				detail: "not theory",
			},
			{
				icon: "/images/figma/90688006-70b1-4791-b37d-d2ba8f113996.svg",
				label: "Qualify for a call",
				detail: "on completion",
			},
		],
		ctaText: "Start free training",
		ctaHref: "/training",
		ctaIcon:
			"/images/figma/8bfb72c0-fdd2-41ca-83ec-d96dc00bd81d.svg",
	},
];

export default function CtaCards() {
	return (
		<div className="flex gap-8 justify-center mt-[200px]">
			{cards.map((card) => (
				<div
					key={card.label}
					className={`cta-card mt-[52px] ${card.variant === "silver" ? "cta-card-silver h-fit" : ""}`}
					style={{ flex: "0 0 calc(4/12*100%)" }}
				>
					<div className="relative flex flex-col">
						<div className="inline-flex items-center justify-center self-start">
							<span className="text-xs font-normal tracking-[1.2px] uppercase whitespace-nowrap text-[#9a9a9a]">
								- {card.label} -
							</span>
						</div>
						<div>
							<h3 className="font-serif text-[44px] leading-[60px] font-normal text-white">
								{card.title}
								<span
									className={`block ${card.titleLine2Gold ? "text-[#f0df7a]" : ""}`}
								>
									{card.titleLine2}
								</span>
							</h3>
							<p className="text-lg font-light leading-8 text-[#9a9a9a] mt-2">
								{card.description}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						{card.features.map((f) => (
							<div
								key={f.label}
								className="flex items-center gap-4 text-lg font-light text-white leading-8"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={f.icon}
									className="w-[18px] h-[18px] shrink-0"
									alt=""
								/>
								<span>
									{f.label} – <span className="text-[#9a9a9a]">{f.detail}</span>
								</span>
							</div>
						))}
					</div>

					<div className="flex flex-col gap-5 items-center w-full">
						<a
							href={card.ctaHref}
							className={`${card.variant === "gold" ? "btn-cta-gold" : "btn-cta-silver"} w-full flex items-center justify-center gap-2.5 px-11 py-6 rounded-[60px] text-lg font-light text-white no-underline whitespace-nowrap transition-opacity active:opacity-80`}
						>
							{card.ctaText}
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={card.ctaIcon} width={24} height={24} alt="" />
						</a>
						{card.scarcity && (
							<p className="text-xs font-normal tracking-[1.2px] uppercase text-[#9a9a9a] text-center">
								<span className="text-white">{card.scarcity}</span> remaining
								this week
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
