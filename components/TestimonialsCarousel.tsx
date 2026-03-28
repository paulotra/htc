"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import Pill from "./Pill";

interface Testimonial {
	vimeoId: string;
	amount: string;
	period: string;
	name: string;
	subtitle: string;
}

const testimonials: Testimonial[] = [
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		subtitle: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		subtitle: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		subtitle: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		subtitle: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		subtitle: "Financial stress to $10K/month.",
	},
];

const CARD_WIDTH = 400;
const GAP = 32;
const VISIBLE = 3;
const MAX_INDEX = testimonials.length - VISIBLE;

function TestimonialCard({ t }: { t: Testimonial }) {
	const [playing, setPlaying] = useState(false);

	return (
		<div className="tc-card">
			{playing ? (
				<iframe
					className="tc-video"
					src={`https://player.vimeo.com/video/${t.vimeoId}?autoplay=1&controls=1&autopause=0&app_id=122963`}
					allow="autoplay; fullscreen"
					allowFullScreen
				/>
			) : (
				<>
					<iframe
						className="tc-video"
						src={`https://player.vimeo.com/video/${t.vimeoId}?autoplay=0&loop=0&controls=0&background=1&app_id=122963`}
						allow="autoplay; fullscreen"
						allowFullScreen
					/>
					<button
						onClick={() => setPlaying(true)}
						className="absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-transparent cursor-pointer"
						aria-label="Play video"
					>
						<div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="#f5c957"
								className="relative left-[2px]"
							>
								<polygon points="5,3 19,12 5,21" />
							</svg>
						</div>
					</button>
				</>
			)}
			<div className="tc-overlay pointer-events-none" />
			<div className="relative z-[1] flex gap-3 items-end">
				<span className="font-sans font-bold text-[2.75rem] leading-[3.75rem] text-[#f0df7a] whitespace-nowrap">
					{t.amount}
				</span>
				<span
					className="shrink-0 relative"
					style={{
						width: "1px",
						height: "36px",
						rotate: "32deg",
						backgroundColor: "#fff",
						opacity: 0.4,
						top: "2px",
					}}
				/>
				<span className="font-sans font-normal text-2xl text-white whitespace-nowrap relative top-3">
					{t.period}
				</span>
			</div>
			<div className="relative z-[1] flex items-center justify-between w-full">
				<div className="flex flex-col gap-3 w-[235px]">
					<p className="font-serif text-[2.625rem] text-white leading-[1.1]">
						{t.name}
					</p>
					<p className="font-sans font-light text-base text-[#9a9a9a]">
						{t.subtitle}
					</p>
				</div>
			</div>
		</div>
	);
}

export default function TestimonialsCarousel() {
	const trackRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);

	function goTo(next: number) {
		const clamped = Math.max(0, Math.min(next, MAX_INDEX));
		setIndex(clamped);
		gsap.to(trackRef.current, {
			x: -(clamped * (CARD_WIDTH + GAP)),
			duration: 0.6,
			ease: "power3.inOut",
		});
	}

	return (
		<section>
			<div className="flex flex-col items-center text-center max-w-[800px] mx-auto mt-20 md:mt-[160px]">
				<Pill>Real Results</Pill>
				<h2 className="font-serif text-[3.75rem] leading-[4.25rem] font-normal text-white mt-5">
					What Our
					<span className="block text-[#f0df7a]">Closer Says</span>
				</h2>
				<p className="text-lg font-light leading-8 text-[#9a9a9a] mt-5">
					Over 50 digital experts have already transformed their brands with my
					proven strategies. Get Ready to join them and create a brand that
					works for you.
				</p>
			</div>

			{/* Carousel */}
			<div className="relative mt-[52px] group">
				{/* Viewport */}
				<div
					className="overflow-hidden mx-auto"
					style={{ width: VISIBLE * CARD_WIDTH + (VISIBLE - 1) * GAP }}
				>
					{/* Track */}
					<div
						ref={trackRef}
						className="flex"
						style={{ gap: GAP, willChange: "transform" }}
					>
						{testimonials.map((t, i) => (
							<TestimonialCard key={i} t={t} />
						))}
					</div>
				</div>

				{/* Prev / Next */}
				<button
					onClick={() => goTo(index - 1)}
					disabled={index === 0}
					className="absolute left-[-32px] top-1/2 -translate-y-1/2 -mt-4 w-10 h-10 rounded-full bg-[#423a2e] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:!opacity-0"
					aria-label="Previous"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#f5c957"
						strokeWidth="2"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
				</button>
				<button
					onClick={() => goTo(index + 1)}
					disabled={index === MAX_INDEX}
					className="absolute right-[-32px] top-1/2 -translate-y-1/2 -mt-4 w-10 h-10 rounded-full bg-[#423a2e] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:!opacity-0"
					aria-label="Next"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#f5c957"
						strokeWidth="2"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</button>

				{/* Dots */}
				<div className="flex justify-center gap-2 mt-8transition-opacity">
					{Array.from({ length: MAX_INDEX + 1 }).map((_, i) => (
						<button
							key={i}
							onClick={() => goTo(i)}
							className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-[#f5c957] w-4" : "bg-[#423a2e]"}`}
							aria-label={`Go to slide ${i + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
