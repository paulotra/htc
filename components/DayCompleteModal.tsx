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
	const continueRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	// Confetti
	useEffect(() => {
		if (firedRef.current) return;
		firedRef.current = true;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

	// Auto-focus dialog on open so screen readers announce its title first
	useEffect(() => {
		dialogRef.current?.focus();
	}, []);

	// Escape key closes modal
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onContinue();
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onContinue]);

	// Focus trap
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		function onKeyDown(e: KeyboardEvent) {
			if (e.key !== "Tab") return;
			const focusable = dialog!.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		}
		dialog.addEventListener("keydown", onKeyDown);
		return () => dialog.removeEventListener("keydown", onKeyDown);
	}, []);

	const msg = DAY_MESSAGES[day] ?? DAY_MESSAGES[0];
	const lineProgress = Math.min(completedDays / 4, 1) * 100;
	const nextDay = day + 2; // human-readable next day number

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center px-4"
			style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
			onClick={(e) => {
				if (e.target === e.currentTarget) onContinue();
			}}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="day-complete-title"
				aria-describedby="day-complete-desc"
				tabIndex={-1}
				className="relative w-full max-w-[440px] rounded-[4px] overflow-hidden flex flex-col items-center gap-0 pb-10 pt-14 px-8"
				style={{
					background: "#000",
					border: "1px solid rgba(66,58,46,0.6)",
					animation: "fadeUp 0.4s ease forwards",
				}}
			>
				{/* Star icon — decorative */}
				<div
					className="relative w-[80px] h-[80px] flex items-center justify-center"
					aria-hidden="true"
				>
					<svg
						width="80"
						height="80"
						viewBox="0 0 80 80"
						fill="none"
						className="relative z-10"
						style={{ filter: "drop-shadow(0 0 12px rgba(247,226,128,0.5))" }}
					>
						<path
							d="M39.9998 6.15381L48.4614 23.2307L67.3845 26L53.6922 39.3846L56.9229 58.1538L39.9998 49.0769L23.0768 58.1538L26.3075 39.3846L12.6152 26L31.5383 23.2307L39.9998 6.15381Z"
							fill="#C9A84C"
							stroke="#F7E280"
							strokeWidth="2.30769"
							strokeLinejoin="round"
						/>
						<path
							d="M34 35.4444L37.3846 39L45 31"
							stroke="black"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>

				{/* Heading */}
				<h2
					id="day-complete-title"
					className="font-serif text-[2rem] text-white text-center mb-3 leading-tight"
					style={{ fontFamily: "'Didact Gothic', 'Playfair Display', serif" }}
				>
					{msg.headline}
				</h2>

				{/* Score + message */}
				<p
					id="day-complete-desc"
					className="text-[15px] font-light text-[#9a9a9a] text-center leading-[1.6] mb-8 max-w-[320px]"
				>
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
				<div className="w-full mb-10 mx-6" aria-label="Training progress">
					<div
						className="relative flex items-start justify-between w-full"
						role="list"
					>
						{/* Track */}
						<div
							className="absolute top-[46px] left-[20px] right-[20px] h-[2px] bg-[#262626]"
							aria-hidden="true"
						/>
						{/* Filled progress */}
						<div
							className="absolute top-[46px] left-[20px] h-[2px] bg-[#f7e280] transition-all duration-700 ease-out"
							aria-hidden="true"
							style={{ width: `calc(${lineProgress}% - 20px)` }}
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

							const nodeLabel = isDone
								? `Day ${i + 1}: completed, scored ${correctCount} out of 3`
								: isNext
									? `Day ${i + 1}: unlocked, ready to start`
									: `Day ${i + 1}: locked`;

							return (
								<div
									key={i}
									role="listitem"
									aria-label={nodeLabel}
									className="relative z-10 flex flex-col items-center gap-2"
									style={{ width: 40 }}
								>
									<p
										className="text-[10px] tracking-[1px] uppercase whitespace-nowrap"
										aria-hidden="true"
										style={{
											color: isDone || isNext ? "#fff" : "#555",
											fontFamily: "'DM Sans', sans-serif",
										}}
									>
										Day {String(i + 1).padStart(2, "0")}
									</p>
									<div
										aria-hidden="true"
										className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
										style={{
											background: isDone
												? "#362f17"
												: isNext
													? "#362f17"
													: "#000",
											border: isDone
												? "1.5px solid #f7e280"
												: isNext
													? "1.5px solid #362f17"
													: "1px solid #2a2a2a",
											boxShadow: isDone
												? "0 0 14px rgba(201,168,76,0.4)"
												: isNext
													? "0 0 10px rgba(247,226,128,0.15)"
													: "none",
										}}
									>
										<span
											style={{
												fontSize: 18,
												opacity: isDone || isNext ? 1 : 0.25,
											}}
										>
											{["🔑", "🧠", "🗺️", "⚔️", "🏆"][i]}
										</span>
									</div>
									<p
										aria-hidden="true"
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
					ref={continueRef}
					onClick={onContinue}
					aria-label={
						day < 4 ? `Continue to Day ${nextDay}` : "View your results"
					}
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
						aria-hidden="true"
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
