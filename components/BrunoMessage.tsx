import Pill from "./Pill";

const imgStar = "/images/figma/44cd1a86-391d-461d-854e-6b6c19381a79.svg";

export default function BrunoMessage() {
	return (
		<div className="text-center md:text-left flex flex-col md:flex-row items-center justify-between mt-16 md:mt-[160px]">
			{/* Left: text block */}
			<div className="flex flex-col gap-10 shrink-0 flex-1">
				<div className="flex flex-col gap-5 items-center md:items-start">
					{/* Badge */}
					<Pill>Watch This Now</Pill>

					{/* Heading */}
					<h2 className="font-serif text-[3.75rem] leading-[4.25rem] font-normal text-white">
						A Message
						<span className="block text-[#f0df7a]">From Bruno</span>
					</h2>

					{/* Subtext */}
					<p className="text-lg font-light leading-8 text-[#9a9a9a] max-w-[528px]">
						Before our call — watch this short video. It&apos;ll take 3 minutes
						and make our conversation 10x more valuable.
					</p>
				</div>

				{/* Callout box */}
				<div
					className="flex flex-col gap-4 border-l-2 border-[#e5ce78] px-8 py-5 w-full mx-auto md:mx-0 max-w-[446px] text-left"
					style={{
						background: "linear-gradient(to right, #000000 0%, #D6B87560 100%)",
						WebkitMaskImage:
							"linear-gradient(to right, black 60%, transparent 100%)",
						maskImage: "linear-gradient(to right, black 60%, transparent 100%)",
					}}
				>
					<div className="flex items-center gap-2.5">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={imgStar}
							width={19}
							height={19}
							alt=""
							className="shrink-0"
						/>
						<span className="text-xs font-normal tracking-[0.075rem] uppercase text-white whitespace-nowrap">
							Don&apos;t Miss This Call
						</span>
					</div>
					<p className="text-sm italic leading-5 text-[#9a9a9a]">
						Bruno explains exactly what will happen on the call and how to get
						the most out of it.
					</p>
				</div>
			</div>

			{/* Right: video placeholder */}
			<div
				className="shrink-0 flex-1 h-[456px] rounded-[4px]"
				style={{ background: "rgba(217,217,217,0.08)" }}
			/>
		</div>
	);
}
