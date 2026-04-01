import Link from "next/link";
import type { QAnswers, DayData } from "./training-data";

interface TrainingSidebarProps {
	days: DayData[];
	currentDay: number;
	unlockedDays: number;
	completedDays: number;
	showCompletion: boolean;
	quizAnswers: QAnswers;
	totalScore: number;
	onGoToDay: (i: number) => void;
	onOpenRecovery: () => void;
}

export default function TrainingSidebar({
	days,
	currentDay,
	unlockedDays,
	completedDays,
	showCompletion,
	quizAnswers,
	totalScore,
	onGoToDay,
	onOpenRecovery,
}: TrainingSidebarProps) {
	const progressPct = Math.max((completedDays / 5) * 100, 4);
	const scoreBarPct = (totalScore / 15) * 100;

	return (
		<aside className="htc-sidebar md:fixed left-0 top-0 bottom-0 md:w-[300px] bg-[#070707] md:border-r border-[rgba(66,58,46,0.5)] flex flex-col z-10">
			{/* Logo */}
			<div className="px-6 h-[81px] hidden md:flex items-center shrink-0">
				<Link href="/">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/images/logo.svg"
						width={180}
						alt="High Ticket Consulting"
					/>
				</Link>
			</div>

			{/* Progress */}
			<div className="px-6 py-4 border-t border-b border-[rgba(66,58,46,0.5)] flex flex-col gap-3 shrink-0">
				<p className="text-[#9a9a9a] text-[11px] tracking-[1.2px] uppercase font-light">
					Your progress
				</p>
				<div className="h-[4px] w-full bg-[rgba(66,58,46,0.5)] rounded-sm overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f7e280] transition-[width] duration-700"
						style={{ width: progressPct + "%" }}
					/>
				</div>
				<p className="text-xs text-white">
					<span className="font-bold text-gold">{completedDays}</span>
					{" of 5 days completed"}
				</p>
			</div>

			{/* Day nav */}
			<nav aria-label="Day navigation" className="flex-1 overflow-y-auto md:block hidden">
				{days.map((day, i) => {
					const isUnlocked = i < unlockedDays;
					const isDone = i < completedDays;
					const isActive = i === currentDay && !showCompletion;
					const answerCount = Object.keys(quizAnswers[i] || {}).length;
					const pct = isDone ? 100 : Math.round((answerCount / 3) * 100);
					const r = 24;
					const circ = 2 * Math.PI * r;
					const dashOffset = circ - (pct / 100) * circ;

					return (
						<button
							key={i}
							onClick={() => isUnlocked && onGoToDay(i)}
							disabled={!isUnlocked}
							aria-current={isActive ? "step" : undefined}
							aria-label={`${day.shortTitle}, Day ${i + 1}${isDone ? ', completed' : isActive ? ', current' : isUnlocked ? ', unlocked' : ', locked'}`}
							className={`w-full text-left flex gap-[10px] items-start pl-4 pr-6 py-4 border-b border-[rgba(66,58,46,0.5)] transition-all ${isUnlocked ? "cursor-pointer" : "cursor-default opacity-20"}`}
							style={
								isActive
									? {
											backgroundImage:
												"linear-gradient(270deg, rgba(99,99,99,0.2) 0%, rgba(255,255,255,0) 100%), radial-gradient(ellipse 140px 120px at -4% 50%, rgba(201,165,114,0.3) 0%, transparent 70%)",
										}
									: isDone
										? {
												background:
													"linear-gradient(270deg, rgba(99,99,99,0.2) 0%, rgba(255,255,255,0) 100%)",
											}
										: undefined
							}
						>
							{/* Circle indicator */}
							{isDone ? (
								<div className="w-[57px] h-[57px] flex items-center justify-center shrink-0">
									<div className="w-[50px] h-[50px] rounded-full bg-[#c9a84c] flex items-center justify-center">
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#070707"
											strokeWidth="2.5"
										>
											<path d="M20 6L9 17l-5-5" />
										</svg>
									</div>
								</div>
							) : (
								<div className="relative w-[57px] h-[57px] shrink-0">
									<svg
										className="absolute inset-0"
										width="57"
										height="57"
										viewBox="0 0 57 57"
									>
										<circle
											cx="28.5"
											cy="28.5"
											r={r}
											fill="none"
											stroke="rgba(66,58,46,0.5)"
											strokeWidth="2"
										/>
										{pct > 0 && (
											<circle
												cx="28.5"
												cy="28.5"
												r={r}
												fill="none"
												stroke={isActive ? "#f7e280" : "#c9a84c"}
												strokeWidth="2"
												strokeDasharray={circ}
												strokeDashoffset={dashOffset}
												strokeLinecap="round"
												transform="rotate(-90 28.5 28.5)"
											/>
										)}
									</svg>
									<span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white uppercase">
										{pct}%
									</span>
								</div>
							)}

							{/* Day info */}
							<div className="flex items-center justify-between h-[57px] flex-1 min-w-0">
								<div className="flex flex-col gap-[3px] min-w-0">
									<p className="text-[#9a9a9a] text-[11px] tracking-[1.2px] uppercase font-light">
										Day 0{i + 1}
									</p>
									<p
										className={`text-[15px] font-light truncate ${isActive ? "text-[#f7e280]" : "text-white"}`}
									>
										{day.shortTitle}
									</p>
									<p className="text-[#9a9a9a] text-[11px] font-light">
										{day.duration}
									</p>
								</div>
								<svg
									className={`shrink-0 ml-2 ${isActive ? "text-[#f7e280]" : "text-[#9a9a9a]"}`}
									width="6"
									height="10"
									viewBox="0 0 6 10"
									fill="none"
								>
									<path
										d="M1 1l4 4-4 4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</button>
					);
				})}
			</nav>

			{/* Quiz score */}
			{/* <div className="border-t border-[rgba(66,58,46,0.5)] px-6 pt-5 pb-4 shrink-0">
				<p className="text-[#9a9a9a] text-[11px] tracking-[1.2px] uppercase font-light mb-3">
					Quiz score
				</p>
				<div className="flex items-end gap-1 mb-3 font-serif">
					<span className="font-bold text-gold text-[26px] leading-none">
						{totalScore}
					</span>
					<span className="text-white text-sm leading-[1.6] relative top-[2px] left-[2px]">
						/ 15
					</span>
				</div>
				<div className="h-[4px] w-full bg-[rgba(66,58,46,0.5)] rounded-sm overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f7e280] transition-[width] duration-500"
						style={{ width: scoreBarPct + "%" }}
					/>
				</div>
			</div> */}

			{/* Streak + recovery */}
			<div className="px-6 pb-6 pt-6 shrink-0 flex flex-col items-center gap-3">
				<div
					className="w-full border border-[rgba(247,226,128,0.2)] rounded-[2px] px-4 pt-3 pb-2 flex flex-col gap-1"
					style={{
						background: "linear-gradient(-90deg, rgba(47,43,24,0.5) 4%)",
					}}
				>
					<p className="text-white text-[11px] tracking-[1.2px] uppercase font-light">
						Day Streak
					</p>
					<div className="flex items-center gap-1">
						<span className="text-[20px] leading-none relative top-[1px]">
							💰
						</span>
						<span className="font-serif font-bold text-white text-[26px] leading-none">
							{Math.max(completedDays, 1)}
						</span>
					</div>
				</div>
				<button
					onClick={onOpenRecovery}
					className="text-[#9a9a9a] text-xs font-light hover:text-white transition-colors text-center w-full"
				>
					Lost your link?
				</button>
			</div>
		</aside>
	);
}
