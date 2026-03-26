"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";

const TEXT = "text-[#9a9a9a]";
const GOLD = "text-white";

const SITUATIONS = [
	{ key: "9-5", label: "Stuck in a 9-5, want out" },
	{
		key: "freelance",
		label: "Freelancing or self-employed, income is inconsistent",
	},
	{ key: "sales", label: "Already in sales, want to level up to high-ticket" },
	{ key: "other", label: "Something else" },
];

const GOALS = [
	{ key: "3k", label: "$3,000 — $5,000/month" },
	{ key: "5k", label: "$5,000 — $10,000/month" },
	{ key: "10k", label: "$10,000+/month" },
];

const OBSTACLES = [
	{ key: "knowledge", label: "I don't know how closing actually works" },
	{ key: "offers", label: "I can't find good offers to close for" },
	{ key: "mindset", label: "Mindset — I freeze under pressure" },
	{ key: "consistency", label: "I start things but don't follow through" },
];

const KEYS = ["A", "B", "C", "D"];

interface Answers {
	name?: string;
	situation?: string;
	goal?: string;
	obstacle?: string;
	scale?: number;
}

export default function TrainingPage() {
	const [slide, setSlide] = useState(0);
	const [animating, setAnimating] = useState(false);
	const [answers, setAnswers] = useState<Answers>({});
	const [error, setError] = useState("");
	const nameRef = useRef<HTMLInputElement>(null);

	const TOTAL = 5;

	const progress = slide === 0 ? 0 : Math.min((slide / TOTAL) * 100, 100);

	function goNext() {
		if (animating) return;
		setError("");
		setAnimating(true);
		setTimeout(() => {
			setSlide((s) => s + 1);
			setAnimating(false);
		}, 320);
	}

	function validateAndNext() {
		if (slide === 1) {
			if (!answers.name?.trim()) {
				setError("Please enter your name to continue.");
				return;
			}
		}
		if (slide === 5) {
			if (!answers.scale) {
				setError("Please select your commitment level.");
				return;
			}
		}
		goNext();
	}

	function selectChoice(key: string, field: keyof Answers) {
		setAnswers((a) => ({ ...a, [field]: key }));
		setError("");
		setTimeout(goNext, 350);
	}

	function selectScale(val: number) {
		setAnswers((a) => ({ ...a, scale: val }));
		setError("");
	}

	// Focus name input when slide 1 appears
	useEffect(() => {
		if (slide === 1) {
			setTimeout(() => nameRef.current?.focus(), 100);
		}
	}, [slide]);

	// Keyboard navigation
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Enter") {
				if (slide === 0) {
					goNext();
					return;
				}
				if (slide === 1 || slide === 5 || slide === 6) {
					validateAndNext();
					return;
				}
			}
			const idx = ["a", "b", "c", "d"].indexOf(e.key.toLowerCase());
			if (idx !== -1) {
				if (slide === 2) selectChoice(SITUATIONS[idx]?.key, "situation");
				if (slide === 3) selectChoice(GOALS[idx]?.key, "goal");
				if (slide === 4) selectChoice(OBSTACLES[idx]?.key, "obstacle");
			}
			if (slide === 5 && /^[1-9]$/.test(e.key)) selectScale(parseInt(e.key));
			if (slide === 5 && e.key === "0") selectScale(10);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	const slideClass = `flex flex-col gap-8 transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`;

	return (
		<div className="relative">
			<Nav badge="3 Spots Open" border />

			<div
				className="absolute inset-0 opacity-60 z-0"
				style={{
					backgroundImage: "url(/images/middle.webp)",
					backgroundPosition: "center top",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			/>
			<div className="max-w-container mx-auto px-7 flex gap-16 items-start pt-32 pb-10 min-h-screen relative z-10">
				{/* ── Left panel ── */}
				<div className="relative">
					<div className="flex-[0_0_380px] sticky top-36 flex flex-col gap-8">
						<div className="flex flex-col gap-3">
							<h1 className="font-serif text-[32px] leading-[40px] font-normal">
								<span className="text-[#9a9a9a]">HTC</span>
								<span className="block text-white text-transparent">
									Training
								</span>
							</h1>
							<div className="flex gap-3 flex-wrap">
								{["5 Days", "Video + Live", "Free"].map((label) => (
									<div
										key={label}
										className="border border-[#423a2e] rounded-[4px] px-2 py-1 text-[#9a9a9a] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap"
									>
										{label}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* ── Right card ── */}
				<div className="flex-1 cta-card cta-card-silver !p-0 !bg-black min-h-[calc(100vh_-_168px)] flex flex-col">
					{/* Progress bar */}
					{slide > 0 && slide < 6 && (
						<div className="h-[2px] bg-[#1a1a18] rounded-t-sm overflow-hidden">
							<div
								className="h-full bg-[#fff] transition-all duration-500"
								style={{ width: `${progress}%` }}
							/>
						</div>
					)}

					<div className="flex-1 flex flex-col justify-center items-center p-10 text-center">
						{/* ── Slide 0: Welcome ── */}
						{slide === 0 && (
							<div className={slideClass}>
								<h2 className="font-serif text-[52px] leading-[1.0] font-normal text-white">
									The Free <span className={GOLD}>5-Day</span>
									<br />
									Closer Training
								</h2>
								<p
									className={`text-base font-light leading-[1.7] max-w-[480px] ${TEXT}`}
								>
									Most people spend years stuck in low-ticket jobs, watching
									others close $10k months. This training changes that. 5 days.
									Real frameworks. Zero fluff.
								</p>
								<div>
									<button
										onClick={goNext}
										className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white transition-opacity active:opacity-80"
									>
										Apply Now
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</button>
									<p className={`text-[12px] mt-3 tracking-[1px] ${TEXT}`}>
										TAKES 2 MINUTES
									</p>
								</div>
							</div>
						)}

						{/* ── Slide 1: Name ── */}
						{slide === 1 && (
							<div className={slideClass}>
								<QNumber n="01" />
								<p className="font-serif text-[40px] leading-[1.05] font-normal text-white">
									What's your first name?
								</p>
								<input
									ref={nameRef}
									type="text"
									placeholder="Type your answer..."
									value={answers.name ?? ""}
									onChange={(e) => {
										setAnswers((a) => ({ ...a, name: e.target.value }));
										setError("");
									}}
									onKeyDown={(e) => e.key === "Enter" && validateAndNext()}
									className="bg-transparent border-b border-[#2a2a2a] focus:border-[#fff] text-white text-[22px] font-light py-3 outline-none w-full transition-colors caret-[#fff] placeholder:text-[#333]"
								/>
								{error && (
									<p className="text-[#e05555] text-[13px] tracking-[1px]">
										{error}
									</p>
								)}
								<ContinueBtn onClick={validateAndNext} />
							</div>
						)}

						{/* ── Slide 2: Situation ── */}
						{slide === 2 && (
							<div className={slideClass}>
								<QNumber n="02" />
								<p className="font-serif text-[40px] leading-[1.05] font-normal text-white">
									What's your current situation?
								</p>
								<p
									className={`text-base font-light leading-[1.6] -mt-4 ${TEXT}`}
								>
									Be honest. This helps me understand where you're starting
									from.
								</p>
								<Choices
									items={SITUATIONS}
									selected={answers.situation}
									onSelect={(k) => selectChoice(k, "situation")}
								/>
								{error && (
									<p className="text-[#e05555] text-[13px] tracking-[1px]">
										{error}
									</p>
								)}
							</div>
						)}

						{/* ── Slide 3: Income goal ── */}
						{slide === 3 && (
							<div className={slideClass}>
								<QNumber n="03" />
								<p className="font-serif text-[40px] leading-[1.05] font-normal text-white">
									What's your monthly income goal for the next 90 days?
								</p>
								<Choices
									items={GOALS}
									selected={answers.goal}
									onSelect={(k) => selectChoice(k, "goal")}
								/>
								{error && (
									<p className="text-[#e05555] text-[13px] tracking-[1px]">
										{error}
									</p>
								)}
							</div>
						)}

						{/* ── Slide 4: Obstacle ── */}
						{slide === 4 && (
							<div className={slideClass}>
								<QNumber n="04" />
								<p className="font-serif text-[40px] leading-[1.05] font-normal text-white">
									What's your biggest obstacle right now?
								</p>
								<Choices
									items={OBSTACLES}
									selected={answers.obstacle}
									onSelect={(k) => selectChoice(k, "obstacle")}
								/>
								{error && (
									<p className="text-[#e05555] text-[13px] tracking-[1px]">
										{error}
									</p>
								)}
							</div>
						)}

						{/* ── Slide 5: Commitment scale ── */}
						{slide === 5 && (
							<div className={slideClass}>
								<QNumber n="05" />
								<p className="font-serif text-[40px] leading-[1.05] font-normal text-white">
									How serious are you — on a scale of 1 to 10?
								</p>
								<p
									className={`text-base font-light leading-[1.6] -mt-4 ${TEXT}`}
								>
									1 = just browsing. 10 = I will do whatever it takes.
								</p>
								<div className="flex flex-col gap-3">
									<div className="flex gap-2">
										{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
											<button
												key={n}
												onClick={() => selectScale(n)}
												className={`flex-1 h-10 rounded-[3px] border text-[13px] font-light transition-all ${
													answers.scale === n
														? "bg-[#fff] border-[#fff] text-black font-medium"
														: "border-[rgba(255,255,255,0.07)] text-[rgba(237,232,222,0.38)] hover:border-[#fff] hover:text-white"
												}`}
											>
												{n}
											</button>
										))}
									</div>
									<div className="flex justify-between text-[12px] text-[rgba(237,232,222,0.38)]">
										<span>Just browsing</span>
										<span>Whatever it takes</span>
									</div>
								</div>
								{error && (
									<p className="text-[#e05555] text-[13px] tracking-[1px]">
										{error}
									</p>
								)}
								<div>
									<button
										onClick={validateAndNext}
										className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white transition-opacity active:opacity-80"
									>
										Get My Free Training
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</button>
									<p className={`text-[12px] mt-3 tracking-[1px] ${TEXT}`}>
										Press Enter ↵
									</p>
								</div>
							</div>
						)}

						{/* ── Slide 6: Complete ── */}
						{slide === 6 && (
							<div className={slideClass}>
								<div className="w-16 h-16 rounded-full border border-[#fff] flex items-center justify-center text-[#fff] mx-auto">
									<svg
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
									>
										<path d="M20 6L9 17l-5-5" />
									</svg>
								</div>
								<h2 className="font-serif text-[52px] leading-[1.0] font-normal text-white">
									You're In, {answers.name || "Closer"}
								</h2>
								<p
									className={`text-[16px] font-light leading-[1.7] max-w-[480px] ${TEXT}`}
								>
									You've done what most people never will — you took the first
									step.
									<br />
									<br />
									Day 1 of your closer training starts right now. 5 videos. Real
									frameworks. By the end, you'll know exactly how to close
									high-ticket offers and what your next move is.
								</p>
								<div>
									<button className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-10 py-5 rounded-full text-[16px] font-medium text-white transition-opacity active:opacity-80">
										Start Day 1 Now
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Slide counter */}
					{slide > 0 && slide < 6 && (
						<div className={`px-10 pb-6 text-[12px] tracking-[2px] ${TEXT}`}>
							<span className={GOLD}>{slide}</span> / {TOTAL}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function QNumber({ n }: { n: string }) {
	return (
		<div className="flex items-center gap-3 text-[11px] tracking-[3px] uppercase text-white">
			{n}
			<span className="block w-6 h-px bg-[#fff] opacity-50" />
		</div>
	);
}

function Choices({
	items,
	selected,
	onSelect,
}: {
	items: { key: string; label: string }[];
	selected?: string;
	onSelect: (key: string) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			{items.map((item, i) => {
				const isSelected = selected === item.key;
				return (
					<button
						key={item.key}
						onClick={() => onSelect(item.key)}
						className={`flex items-center gap-4 px-5 py-4 rounded-[4px] border text-left text-[16px] font-light transition-all ${
							isSelected
								? "border-[#fff] bg-[rgba(245,201,87,0.06)] text-white"
								: "border-[rgba(255,255,255,0.07)] text-[rgba(237,232,222,0.55)] hover:border-[#fff] hover:bg-[rgba(245,201,87,0.06)] hover:text-white"
						}`}
					>
						<span
							className={`text-[11px] px-2 py-0.5 rounded-[3px] min-w-[28px] text-center transition-all ${
								isSelected
									? "bg-[#fff] text-black font-medium"
									: "bg-[rgba(255,255,255,0.07)] text-[rgba(237,232,222,0.38)]"
							}`}
						>
							{KEYS[i]}
						</span>
						{item.label}
					</button>
				);
			})}
		</div>
	);
}

function ContinueBtn({ onClick }: { onClick: () => void }) {
	return (
		<div>
			<button
				onClick={onClick}
				className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white transition-opacity active:opacity-80"
			>
				Continue
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
			<p className="text-[12px] mt-3 tracking-[1px] text-[rgba(237,232,222,0.38)]">
				Press Enter ↵
			</p>
		</div>
	);
}
