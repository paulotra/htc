"use client";

import { useEffect, useRef } from "react";
import { DAYS, type QAnswers, type QFlags } from "./training-data";

interface Props {
	day: number; // 0-indexed day just completed
	score: number; // correct answers this day (0-3)
	quizAnswers: QAnswers;
	quizPassed: QFlags;
	completedDays: number;
	onContinue: () => void;
}

const DAY_MESSAGES = [
	{
		headline: "Day 1 Complete.",
		sub: (s: number) =>
			s === 3
				? "Perfect score. You already think like a closer."
				: "The foundation is set. Day 2 is waiting for you.",
	},
	{
		headline: "Day 2 Done.",
		sub: (s: number) =>
			s === 3
				? "Flawless. Most people quit before this point — you're thriving."
				: "Halfway there. Most people quit here. You didn't.",
	},
	{
		headline: "Day 3 Locked In.",
		sub: (s: number) =>
			s === 3
				? "Three perfect days. You're built for this."
				: "3 of 5 complete. You're past the halfway mark — keep the momentum.",
	},
	{
		headline: "Day 4 Mastered.",
		sub: (s: number) =>
			s === 3
				? "Four clean days. One left between you and the finish line."
				: "One day left. The finish line is in sight — don't stop now.",
	},
	{
		headline: "Training Complete.",
		sub: (s: number) =>
			s === 3
				? "Perfect run. You finished what most won't even start."
				: "You finished what most won't even start. That says everything.",
	},
];

export default function DayCompleteModal({
	day,
	score,
	quizAnswers,
	quizPassed,
	completedDays,
	onContinue,
}: Props) {
	const firedRef = useRef(false);

	useEffect(() => {
		if (firedRef.current) return;
		firedRef.current = true;

		import("canvas-confetti").then(({ default: confetti }) => {
			const end = Date.now() + 2200;
			const colors = ["#f7e280", "#c9a84c", "#ffffff", "#f0df7a", "#ffe066"];

			function frame() {
				confetti({
					particleCount: 3,
					angle: 60,
					spread: 55,
					origin: { x: 0 },
					colors,
					zIndex: 9999,
				});
				confetti({
					particleCount: 3,
					angle: 120,
					spread: 55,
					origin: { x: 1 },
					colors,
					zIndex: 9999,
				});
				if (Date.now() < end) requestAnimationFrame(frame);
			}
			frame();
		});
	}, []);

	const msg = DAY_MESSAGES[day] ?? DAY_MESSAGES[0];
	// Progress line width: completed days / 4 segments × 100%
	const lineProgress = Math.min(completedDays / 4, 1) * 100;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center px-4"
			style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
		>
			<div
				className="relative w-full max-w-[440px] rounded-[4px] overflow-hidden flex flex-col items-center gap-0 pb-10 pt-14 px-8"
				style={{
					background: "#000",
					border: "1px solid rgba(66,58,46,0.6)",
					animation: "fadeUp 0.4s ease forwards",
				}}
			>
				{/* Star icon */}
				<div className="relative w-[80px] h-[80px] flex items-center justify-center">
					<svg
						width="80"
						height="80"
						viewBox="0 0 80	 80	"
						fill="none"
						className="relative z-10"
						style={{ filter: "drop-shadow(0 0 12px rgba(247,226,128,0.5))" }}
					>
						<path
							d="M39.9998 6.15381L48.4614 23.2307L67.3845 26L53.6922 39.3846L56.9229 58.1538L39.9998 49.0769L23.0768 58.1538L26.3075 39.3846L12.6152 26L31.5383 23.2307L39.9998 6.15381Z"
							fill="#C9A84C"
							stroke="#F7E280"
							stroke-width="2.30769"
							stroke-linejoin="round"
						/>
						<path
							d="M34 35.4444L37.3846 39L45 31"
							stroke="black"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>

				{/* Heading */}
				<h2
					className="font-serif text-[2rem] text-white text-center mb-3 leading-tight"
					style={{ fontFamily: "'Didact Gothic', 'Playfair Display', serif" }}
				>
					{msg.headline}
				</h2>

				{/* Score + message */}
				<p className="text-[15px] font-light text-[#9a9a9a] text-center leading-[1.6] mb-8 max-w-[320px]">
					You scored{" "}
					<span
						className="font-bold text-[#f7e280]"
						style={{ fontSize: "1.05em" }}
					>
						{score}/3
					</span>{" "}
					on Day {day + 1}. <span>{msg.sub(score)}</span>
				</p>

				{/* Progress map */}
				<div className="w-full mb-10 px-6">
					<div className="relative flex items-start justify-between w-full">
						{/* Track */}
						<div className="absolute top-[39px] left-[20px] right-[20px] h-[2px] bg-[#262626]" />
						{/* Filled progress */}
						<div
							className="absolute top-[39px] left-[20px] h-[2px] bg-[#f7e280] transition-all duration-700 ease-out"
							style={{ width: `calc(${lineProgress}% - 0px)` }}
						/>

						{[0, 1, 2, 3, 4].map((i) => {
							const isDone = i < completedDays;
							const isNext = i === completedDays && i < 5;

							const correctCount = (() => {
								if (!isDone) return null;
								const a = quizAnswers[i] || {};
								let c = 0;
								DAYS[i]?.quiz.forEach((q, qi) => {
									if (a[qi] === q.correct) c++;
								});
								return c;
							})();

							return (
								<div
									key={i}
									className="relative z-10 flex flex-col items-center gap-2"
									style={{ width: 40 }}
								>
									<p
										className="text-[10px] tracking-[1px] uppercase whitespace-nowrap"
										style={{
											color: isDone || isNext ? "#fff" : "#555",
											fontFamily: "'DM Sans', sans-serif",
										}}
									>
										Day {String(i + 1).padStart(2, "0")}
									</p>
									<div
										className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
										style={{
											background: isDone
												? "linear-gradient(135deg, #c9a84c, #f7e280)"
												: isNext
													? "#111"
													: "#000",
											border: isDone
												? "none"
												: isNext
													? "1.5px solid #f7e280"
													: "1px solid #2a2a2a",
											boxShadow: isDone
												? "0 0 14px rgba(201,168,76,0.4)"
												: isNext
													? "0 0 10px rgba(247,226,128,0.15)"
													: "none",
										}}
									>
										{isDone ? (
											/* Checkmark */
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#000"
												strokeWidth="2.8"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="20 6 9 17 4 12" />
											</svg>
										) : isNext ? (
											/* Unlocked lock */
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#f7e280"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<rect x="3" y="11" width="18" height="11" rx="2" />
												<path d="M7 11V7a5 5 0 019.9-1" />
											</svg>
										) : (
											/* Locked lock */
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#333"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<rect x="3" y="11" width="18" height="11" rx="2" />
												<path d="M7 11V7a5 5 0 0110 0v4" />
											</svg>
										)}
									</div>
									<p
										className="text-[11px]"
										style={{
											color: isDone ? "#f7e280" : isNext ? "#f7e280" : "#333",
											fontFamily: "'DM Sans', sans-serif",
										}}
									>
										{isDone ? `${correctCount}/3` : isNext ? "Next" : "—"}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Continue button */}
				<button
					onClick={onContinue}
					className="relative w-full flex items-center justify-center gap-3 py-4 px-10 rounded-[60px] text-white text-[17px] font-light cursor-pointer transition-opacity hover:opacity-90 active:opacity-70 overflow-hidden"
					style={{
						border: "1px solid #dfcaac",
						background:
							"radial-gradient(ellipse at 50% 120%, #c9a572 0%, rgba(240,223,122,0) 70%)",
						boxShadow: "inset 0px -2px 14px 0px #ffc26c",
					}}
				>
					Continue
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	);
}
