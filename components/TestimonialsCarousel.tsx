"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import Pill from "./Pill";

interface Testimonial {
	vimeoId: string;
	amount: string;
	period: string;
	name: string;
	quote: string;
}

const testimonials: Testimonial[] = [
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		quote: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		quote: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		quote: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		quote: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		quote: "Financial stress to $10K/month.",
	},
	{
		vimeoId: "1066435911",
		amount: "$10k",
		period: "Month",
		name: "Bruno Bajrami",
		quote: "Financial stress to $10K/month.",
	},
];

function TestimonialCard({ t }: { t: Testimonial }) {
	const [playing, setPlaying] = useState(false);

	return (
		<div className="tc-card flex flex-col gap-8 md:border md:border-[#423a2e] rounded-[4px] overflow-hidden">
			{/* Portrait / Video */}
			<div className="relative w-1/2 md:w-full mx-auto overflow-hidden rounded-[2px] aspect-[9/16]">
				<iframe
					className="absolute inset-0 w-full h-full border-none m-auto"
					src={
						playing
							? `https://player.vimeo.com/video/${t.vimeoId}?autoplay=1&controls=1&autopause=0&app_id=122963`
							: `https://player.vimeo.com/video/${t.vimeoId}?autoplay=0&controls=0&background=1&app_id=122963`
					}
					allow="autoplay; fullscreen"
					allowFullScreen
				/>
				{!playing && (
					<button
						onClick={() => setPlaying(true)}
						className="absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-transparent cursor-pointer"
						aria-label="Play video"
					>
						<div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
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
				)}
			</div>

			{/* Text */}
			<div className="flex flex-col gap-5 items-center">
				<div className="flex flex-col gap-2 items-center w-full">
					{/* Amount row */}
					<div className="flex items-end gap-3">
						<span className="font-bold text-[26px] leading-none text-[#f7e280]">
							{t.amount}
						</span>
						<span
							className="shrink-0 relative h-[18px]"
							style={{
								width: "1px",
								rotate: "20deg",
								backgroundColor: "rgba(255,255,255,0.3)",
							}}
						/>
						<span className="text-sm text-white leading-[16px]">
							{t.period}
						</span>
					</div>
					{/* Name */}
					<p className="text-[18px] font-medium text-white text-center">
						- {t.name}
					</p>
				</div>
				{/* Quote */}
				<p className="text-[18px] italic text-[#9a9a9a] text-center w-full">
					&ldquo;{t.quote}&rdquo;
				</p>
			</div>
		</div>
	);
}

export default function TestimonialsCarousel() {
	const sectionRef = useRef<HTMLElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const ctx = gsap.context(() => {
			const headingEls = section.querySelectorAll("[data-gsap-tc]");
			gsap.from(headingEls, {
				scrollTrigger: { trigger: section, start: "top 88%", once: true },
				y: 24,
				opacity: 0,
				duration: 0.55,
				ease: "power3.out",
				stagger: 0.1,
			});

			const cards = section.querySelectorAll(".tc-card");
			gsap.from(cards, {
				scrollTrigger: {
					trigger: gridRef.current,
					start: "top 90%",
					once: true,
				},
				y: 36,
				opacity: 0,
				duration: 0.5,
				ease: "power3.out",
				stagger: 0.08,
			});
		}, section);

		requestAnimationFrame(() => ScrollTrigger.refresh());

		return () => ctx.revert();
	}, []);

	return (
		<section ref={sectionRef}>
			<div className="flex flex-col items-center text-center max-w-[800px] mx-auto mt-20 md:mt-[160px]">
				<div data-gsap-tc>
					<Pill>Real Results</Pill>
				</div>
				<h2
					data-gsap-tc
					className="font-serif text-4xl  md:text-[3.75rem] md:leading-[4.25rem] font-normal text-white mt-5"
				>
					What Our
					<span className="block text-[#f0df7a]">Closer Says</span>
				</h2>
				<p
					data-gsap-tc
					className="text-lg font-light leading-8 text-[#9a9a9a] mt-5"
				>
					Over 50 digital experts have already transformed their brands with my
					proven strategies. Get Ready to join them and create a brand that
					works for you.
				</p>
			</div>

			<div
				ref={gridRef}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-[52px]"
			>
				{testimonials.map((t, i) => (
					<TestimonialCard key={i} t={t} />
				))}
			</div>
		</section>
	);
}
