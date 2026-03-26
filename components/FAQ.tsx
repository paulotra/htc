"use client";

import { useState } from "react";
import Pill from "./Pill";

const imgTexture =
	"/images/figma/ea884fdf-5cb3-4238-bf28-6d06f58dd26b.png";
const imgPlus =
	"/images/figma/64b88635-bb35-4613-918b-ce3ef4ffbf74.svg";
const imgMinus =
	"/images/figma/09122906-2215-45fe-9913-704149b6d97c.svg";

const questions = [
	"Is this a sales call?",
	"I have no experience. Will this work for me?",
	"What if I can't afford it?",
	"How fast can I start making money?",
	"Do I need a following or an audience?",
	"Is this legit?",
];

export default function FAQ() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<div className="flex items-start justify-between mt-[160px] gap-8">
			{/* Left */}
			<div className="flex flex-col gap-5 items-start shrink-0 flex-[1]">
				<Pill>Before The Call</Pill>
				<h2 className="font-serif text-[3.75rem] leading-[4.25rem] font-normal text-white">
					Questions You
					<span className="block text-[#f0df7a]">Probably Have</span>
				</h2>
				<p className="text-lg font-light leading-8 text-[#9a9a9a]">
					Bruno answers every question you have before you even ask it. Tap to
					watch.
				</p>
			</div>

			{/* Right: accordion */}
			<div className="flex flex-col gap-5 items-start shrink-0 flex-[2]">
				{questions.map((q, i) => {
					const isOpen = open === i;
					return (
						<div
							key={q}
							className="border border-[#423a2e] rounded-[4px] w-full overflow-hidden"
						>
							{/* Row */}
							<button
								onClick={() => setOpen(isOpen ? null : i)}
								className="relative flex items-center justify-between w-full p-6 text-left"
								style={
									!isOpen
										? {
												backgroundImage: `url(${imgTexture})`,
												backgroundSize: "cover",
											}
										: undefined
								}
							>
								{!isOpen && (
									<div className="absolute inset-0 bg-gradient-to-b from-[rgba(99,99,99,0.2)] to-[rgba(255,255,255,0)] pointer-events-none" />
								)}
								<span className="capitalize font-light text-[1.125rem] leading-5 text-white relative">
									{q}
								</span>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={isOpen ? imgMinus : imgPlus}
									width={32}
									height={32}
									alt={isOpen ? "Collapse" : "Expand"}
									className="shrink-0 relative"
								/>
							</button>

							{/* Expanded content */}
							{isOpen && (
								<div className="px-6 pb-6">
									<div className="bg-black w-full h-[456px] rounded-[4px]" />
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
