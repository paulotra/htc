import Pill from "./Pill";

interface Guideline {
	num: string;
	title: string;
	description: string;
	side: "left" | "right";
	isGold: boolean;
}

const guidelines: Guideline[] = [
	{
		num: "01",
		title: "Show Up On Time",
		description:
			"The call starts exactly when scheduled. If you're more than 5 minutes late it gets cancelled and your spot goes to someone else.",
		side: "right",
		isGold: true,
	},
	{
		num: "02",
		title: "Find A Quiet Place.",
		description:
			"No distractions, no background noise. This is a serious conversation about your income and your future.",
		side: "left",
		isGold: false,
	},
	{
		num: "03",
		title: "Come Prepared To Decide",
		description:
			"This is not an info call. By the end you'll know exactly whether this is right for you and we expect an answer.",
		side: "right",
		isGold: false,
	},
	{
		num: "04",
		title: "Have Your Calendar Open",
		description:
			"We'll be mapping out your next 90 days live on the call. Know your schedule.",
		side: "left",
		isGold: false,
	},
];

export default function CallGuidelines() {
	return (
		<section className="flex flex-col gap-[40px] items-center mt-20 md:mt-[160px]">
			<Pill>Before The Call</Pill>

			<div className="flex flex-col gap-[40px] w-full">
				{guidelines.map((item, i) => {
					const isLast = i === guidelines.length - 1;

					const circle = (
						<div
							className={`relative shrink-0 size-[80px] rounded-[32px] flex items-center justify-center border ${item.isGold ? "border-[#423a2e]" : "border-[#414141]"}`}
							style={{
								background:
									"linear-gradient(180deg, rgba(99,99,99,0.2) 0%, rgba(255,255,255,0) 100%)",
							}}
						>
							<span
								className={`text-[1rem] font-normal tracking-[0.1rem] leading-[1rem] uppercase ${
									item.isGold
										? "bg-clip-text text-transparent bg-gradient-to-b from-[#f0df7a] to-[#c9a572]"
										: "text-white/40"
								}`}
							>
								{item.num}
							</span>

							{/* Connector line to next circle */}
							{!isLast && (
								<div className="hidden md:block absolute top-[80px] left-1/2 -translate-x-1/2 w-px h-[76px] bg-white/10" />
							)}
						</div>
					);

					const text = (
						<div
							className={`flex-1 flex flex-col gap-3 ${item.side === "left" ? "md:text-right" : ""}`}
						>
							<h3
								className={`font-serif text-[2rem] leading-[2.5rem] font-normal capitalize ${
									item.isGold
										? "bg-clip-text text-transparent bg-gradient-to-b from-[#f0df7a] to-[#c9a572]"
										: "text-white"
								}`}
							>
								{item.title}
							</h3>
							<p className="text-lg font-light leading-8 text-[#9a9a9a]">
								{item.description}
							</p>
						</div>
					);

					return (
						<div
							key={item.num}
							className={`flex relative gap-[32px] items-start w-[calc(100%)] md:w-[50%] ${item.side === "right" ? "self-end md:left-[-39px]" : "flex-row-reverse md:flex-row self-start md:right-[-39px]"}`}
						>
							{item.side === "right" ? (
								<>
									{circle}
									{text}
								</>
							) : (
								<>
									{text}
									{circle}
								</>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}
