"use client";

import { useRef, useEffect } from "react";
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

export default function TestimonialsCarousel() {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
	}, []);

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

			<div ref={scrollRef} className="tc-scroll">
				{testimonials.map((t, i) => (
					<div key={i} className="tc-card">
						<iframe
							className="tc-video"
							src={`https://player.vimeo.com/video/${t.vimeoId}?autoplay=1&muted=1&loop=1&autopause=0&controls=0&background=1&app_id=122963`}
							allow="autoplay; fullscreen"
							allowFullScreen
						/>
						<div className="tc-overlay" />
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
				))}
			</div>
		</section>
	);
}
