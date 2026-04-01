"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import TrainingSidebar from "./TrainingSidebar";
import TrainingNav from "./TrainingNav";
import {
	DAYS,
	KEYS,
	type DayData,
	type QAnswers,
	type QFlags,
} from "./training-data";
import DayCompleteModal from "./DayCompleteModal";

const C = {
	black: "#070707",
	surface: "#0f0f0f",
	card: "#000",
	border: "rgba(66,58,46,0.5)",
	borderGold: "rgba(201,168,76,0.25)",
	gold: "#c9a84c",
	goldLight: "#e8c96a",
	goldDim: "rgba(201,168,76,0.08)",
	white: "#f4efe5",
	muted: "#555",
	text: "#9a9080",
};

function Portal() {
	const sp = useSearchParams();
	const name = sp.get("name") || "Closer";
	const token = sp.get("token") || "guest";
	const email = sp.get("email") || "";
	const STORAGE_KEY = `htc_progress_${token}`;

	const [currentDay, setCurrentDay] = useState(0);
	const [unlockedDays, setUnlockedDays] = useState(1);
	const [completedDays, setCompletedDays] = useState(0);
	const [quizAnswers, setQuizAnswers] = useState<QAnswers>({});
	const [quizSubmitted, setQuizSubmitted] = useState<QFlags>({});
	const [quizPassed, setQuizPassed] = useState<QFlags>({});
	const [totalScore, setTotalScore] = useState(0);
	const [showCompletion, setShowCompletion] = useState(false);
	const [showDayComplete, setShowDayComplete] = useState(false);
	const [dayCompleteScore, setDayCompleteScore] = useState(0);
	const [playedVideo, setPlayedVideo] = useState(false);
	const [toastMsg, setToastMsg] = useState("");
	const [toastVisible, setToastVisible] = useState(false);
	const [recoveryOpen, setRecoveryOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
			if (saved) {
				setCurrentDay(saved.currentDay ?? 0);
				setUnlockedDays(saved.unlockedDays ?? 1);
				setCompletedDays(saved.completedDays ?? 0);
				setQuizAnswers(saved.quizAnswers ?? {});
				setQuizSubmitted(saved.quizSubmitted ?? {});
				setQuizPassed(saved.quizPassed ?? {});
				setTotalScore(saved.totalScore ?? 0);
			}
		} catch {}
		setLoaded(true);
	}, [STORAGE_KEY]);

	useEffect(() => {
		if (!loaded) return;
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				currentDay,
				unlockedDays,
				completedDays,
				quizAnswers,
				quizSubmitted,
				quizPassed,
				totalScore,
			}),
		);
	}, [
		STORAGE_KEY,
		loaded,
		currentDay,
		unlockedDays,
		completedDays,
		quizAnswers,
		quizSubmitted,
		quizPassed,
		totalScore,
	]);

	useEffect(() => {
		setPlayedVideo(false);
	}, [currentDay]);

	const showToast = useCallback((msg: string) => {
		setToastMsg(msg);
		setToastVisible(true);
		setTimeout(() => setToastVisible(false), 4500);
	}, []);

	const goToDay = (i: number) => {
		setCurrentDay(i);
		setShowCompletion(false);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const selectAnswer = (dayIdx: number, qi: number, oi: number) => {
		if (quizSubmitted[dayIdx]) return;
		setQuizAnswers((prev) => ({
			...prev,
			[dayIdx]: { ...(prev[dayIdx] || {}), [qi]: oi },
		}));
	};

	const submitQuiz = () => {
		const d = DAYS[currentDay];
		const answers = quizAnswers[currentDay] || {};
		if (Object.keys(answers).length < 3) return;
		let correct = 0;
		d.quiz.forEach((q, qi) => {
			if (answers[qi] === q.correct) correct++;
		});
		const passed = correct >= 2;
		setQuizSubmitted((prev) => ({ ...prev, [currentDay]: true }));
		setQuizPassed((prev) => ({ ...prev, [currentDay]: passed }));
		setTotalScore((prev) => prev + correct);
		if (passed) {
			const newCompleted = Math.max(completedDays, currentDay + 1);
			setCompletedDays(newCompleted);
			setUnlockedDays(Math.min(newCompleted + 1, 5));
			setDayCompleteScore(correct);
			setShowDayComplete(true);
			return;
		}
		const toasts = [
			[
				`<strong>${correct}/3 on Day 1.</strong> Day 2 unlocked. Keep going.`,
				`<strong>${correct}/3 on Day 1.</strong> Rewatch and try again.`,
			],
			[
				`<strong>${correct}/3 on Day 2.</strong> Day 3 is yours.`,
				`<strong>${correct}/3 on Day 2.</strong> Go back and rewatch.`,
			],
			[
				`<strong>${correct}/3 on Day 3.</strong> Day 4 unlocked.`,
				`<strong>${correct}/3 on Day 3.</strong> The answers are in the video.`,
			],
			[
				`<strong>${correct}/3 on Day 4.</strong> One more day.`,
				`<strong>${correct}/3 on Day 4.</strong> Rewatch and lock it in.`,
			],
			[
				`<strong>${correct}/3 on Day 5.</strong> Training complete.`,
				`<strong>${correct}/3 on Day 5.</strong> So close — rewatch and finish strong.`,
			],
		];
		showToast(passed ? toasts[currentDay][0] : toasts[currentDay][1]);
	};

	const retakeQuiz = () => {
		const d = DAYS[currentDay];
		const oldAnswers = quizAnswers[currentDay] || {};
		let oldCorrect = 0;
		d.quiz.forEach((q, qi) => {
			if (oldAnswers[qi] === q.correct) oldCorrect++;
		});
		setTotalScore((prev) => Math.max(0, prev - oldCorrect));
		setQuizAnswers((prev) => ({ ...prev, [currentDay]: {} }));
		setQuizSubmitted((prev) => ({ ...prev, [currentDay]: false }));
		setQuizPassed((prev) => ({ ...prev, [currentDay]: false }));
	};

	const triggerCompletion = () => {
		setShowCompletion(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
		const tier = totalScore >= 12 ? "qualified" : "unqualified";
		fetch("/.netlify/functions/completion", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token, name, email, score: totalScore, tier }),
		}).catch(() => {});
	};

	const showCertificate = () => {
		const today = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		const certHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>HTC Certificate</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400&family=DM+Mono:wght@400&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#070707;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px;font-family:'DM Sans',sans-serif}.cert{background:#0d0a00;border:1px solid rgba(201,168,76,0.4);max-width:760px;width:100%;padding:72px 80px;position:relative;text-align:center}.cert::before,.cert::after{content:'';position:absolute;width:60px;height:60px;border-color:rgba(201,168,76,0.3);border-style:solid}.cert::before{top:16px;left:16px;border-width:1px 0 0 1px}.cert::after{bottom:16px;right:16px;border-width:0 1px 1px 0}.logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:500;color:#c9a84c;letter-spacing:4px;margin-bottom:40px}.presents{font-family:'DM Mono',monospace;font-size:10px;color:#555;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px}.name{font-family:'Playfair Display',serif; font-weight: 500;font-size:40px;color:#fff;margin-bottom:4px}.title{font-family:'Playfair Display',serif;font-size:32px;font-weight:500;color:#f4efe5;line-height:1.05;margin-bottom:8px}.title em{color:#c9a84c}.divider{width:60px;height:1px;background:rgba(201,168,76,0.4);margin:32px auto}.score{font-family:'DM Mono',monospace;font-size:12px;color:#555;letter-spacing:3px;margin-bottom:24px}.score span{color:#c9a84c}.body{font-size:15px;color:#9a9080;line-height:1.7;max-width:480px;margin:0 auto 48px;font-weight:300}.footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:40px;border-top:1px solid #1c1c1c}.sig-name{font-family:'Playfair Display',serif;font-size:20px;color:#f4efe5}.sig-role{font-family:'DM Mono',monospace;font-size:10px;color:#555;letter-spacing:3px;text-transform:uppercase;margin-top:4px}.date{font-family:'DM Mono',monospace;font-size:10px;color:#555;letter-spacing:2px}</style></head><body><div class="cert"><div class="logo">HTC</div><div class="presents">High Ticket Consulting — Certifies That</div><div class="name">${name}</div><div class="title">HTC <span style="color: #c9a84c;">Foundation</span> Certificate</div><div class="divider"></div><div class="score">Quiz Score: <span>${totalScore} / 15</span></div><div class="body">Has successfully completed the HTC 5-Day Closer Training — demonstrating commitment, discipline, and the foundational knowledge required to operate as a high-ticket remote closer.</div><div class="footer"><div><div class="sig-name">Bruno Bajrami</div><div class="sig-role">Founder, High Ticket Consulting</div></div><div class="date">${today}</div></div></div></body></html>`;
		const blob = new Blob([certHTML], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const win = window.open(url, "_blank");
		if (win) win.focus();
		setTimeout(() => URL.revokeObjectURL(url), 60000);
	};

	const d = DAYS[currentDay];
	const isLocked = currentDay >= unlockedDays;
	const isDone = currentDay < completedDays;
	const certActive = completedDays >= 5;
	const submitted = quizSubmitted[currentDay];
	const passed = quizPassed[currentDay];
	const answers = quizAnswers[currentDay] || {};
	const allAnswered = Object.keys(answers).length === 3;

	const score = totalScore;
	const qualifiesForCall = score >= 12;
	const qualifiesForAcademy = score >= 10 && score < 12;
	const scoreColor = score >= 12 ? C.gold : score >= 10 ? C.gold : "#e08888";
	const scoreLabel =
		score >= 12
			? "Strategy Call Eligible"
			: score >= 10
				? "Academy Eligible"
				: "Retake Recommended";

	return (
		<div className="bg-[#070707] min-h-screen flex flex-col-reverse md:flex-row">
			{showDayComplete && (
				<DayCompleteModal
					day={currentDay}
					score={dayCompleteScore}
					quizAnswers={quizAnswers}
					quizPassed={quizPassed}
					completedDays={Math.max(completedDays, currentDay + 1)}
					onContinue={() => {
						setShowDayComplete(false);
						if (currentDay < 4) goToDay(currentDay + 1);
					}}
				/>
			)}
			{/* SIDEBAR */}
			<TrainingSidebar
				days={DAYS}
				currentDay={currentDay}
				unlockedDays={unlockedDays}
				completedDays={completedDays}
				showCompletion={showCompletion}
				quizAnswers={quizAnswers}
				totalScore={totalScore}
				onGoToDay={goToDay}
				onOpenRecovery={() => setRecoveryOpen(true)}
			/>

			{/* MAIN */}
			<main
				className="htc-main relative flex flex-col flex-1 min-h-screen"
				style={{ marginLeft: 300 }}
			>
				{/* TOPBAR */}
				<TrainingNav
					name={name}
					certActive={certActive}
					onShowCertificate={showCertificate}
				/>

				{/* CONTENT */}
				<div className="htc-content flex-1 max-w-[900px] px-6 md:px-7 py-8">
					<div
						className="absolute inset-0 opacity-50 z-0 pointer-events-none"
						style={{
							backgroundImage: "url(/images/middle.webp)",
							backgroundPosition: "center center",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
						}}
					></div>
					{/* ── COMPLETION SCREEN ── */}
					{showCompletion ? (
						<div
							className="text-center md:text-left"
							style={{ animation: "fadeUp 0.7s ease forwards" }}
						>
							<div
								className="rounded border border-[rgba(201,168,76,0.25)] relative overflow-hidden mb-10 p-8 md:p-10"
								style={{
									background: "#0a080480",
								}}
							>
								<div className="text-[10px] text-[#c9a84c] justify-center md:justify-start tracking-[5px] uppercase mb-[24px] flex items-center gap-[12px]">
									<span
										className="inline-block h-px bg-[#c9a84c]"
										style={{ width: 20 }}
									/>
									Training Complete
								</div>
								<div className="font-serif leading-none text-[#f4efe5] mb-6 text-4xl md:text-5xl">
									You&apos;ve done what
									<br />
									<span className="text-[#c9a84c]">
										99% of people won&apos;t.
									</span>
								</div>
								<div className="text-base text-[#9a9080] leading-[1.75] max-w-[520px] font-light">
									Most people who found this training never finished Day 1. You
									just finished all 5 — and proved you actually paid attention.
									That tells me everything I need to know about you, {name}.
								</div>
								<div className="flex gap-x-20 gap-y-4 md:gap-10 mt-4 md:mt-10 pt-4 md:pt-10 border-t border-[rgba(66,58,46,0.5)] flex-wrap justify-center md:justify-start">
									<div>
										<div className="font-serif text-2xl font-bold text-[#c9a84c] leading-none">
											5
										</div>
										<div className="text-[10px] text-[#555] tracking-[3px] uppercase mt-[6px]">
											Days Completed
										</div>
									</div>
									<div>
										<div
											className="font-serif text-2xl font-bold leading-none"
											style={{ color: scoreColor }}
										>
											{score}/15
										</div>
										<div className="text-[10px] text-[#555] tracking-[3px] uppercase mt-[6px]">
											Quiz Score
										</div>
									</div>
									<div>
										<div
											className="font-serif text-2xl font-bold leading-none"
											style={{ color: scoreColor }}
										>
											{scoreLabel}
										</div>
										<div className="text-[10px] text-[#555] tracking-[3px] uppercase mt-[6px]">
											Your Status
										</div>
									</div>
								</div>
							</div>

							<div className="text-[10px] text-[#555] tracking-[4px] uppercase mb-[20px] flex items-center gap-[16px]">
								Your Next Move — Based on Your Score
								<span className="flex-1 h-px bg-[rgba(66,58,46,0.5)] block" />
							</div>

							<div
								className="htc-paths-grid mb-6"
								style={{
									gap: 16,
								}}
							>
								{qualifiesForCall ? (
									<>
										<a
											href="/booking"
											className="htc-path-card border border-[rgba(201,168,76,0.25)] rounded flex flex-col gap-[16px] cursor-pointer relative overflow-hidden no-underline text-inherit transition-all duration-300 items-center md:items-stretch"
											style={{
												background: "#0a080480",
												padding: "32px 28px",
											}}
										>
											<div className="text-[10px] tracking-[3px] uppercase py-[4px] px-[10px] rounded-[2px] self-start bg-[#c9a84c] text-[#070707] mx-auto md:mx-0">
												You Qualified — {score}/15
											</div>
											<div className="font-serif text-[24px] font-bold text-[#f4efe5] leading-[1.2]">
												Book a Free Strategy Call
											</div>
											<div className="text-sm text-[#9a9080] leading-[1.65] font-light flex-1">
												You scored {score}/15. That puts you in the top tier. I
												take 5 strategy calls a week — I&apos;ll personally map
												out your next 90 days, your offer, your income targets.
												This is reserved for people who prove they&apos;re
												serious. You did.
											</div>
											<div className="text-xs text-[#c9a84c] tracking-[2px]">
												Free · 45 minutes · Limited to 5 spots/week
											</div>
											<div className="flex items-center justify-between pt-[16px] border-t border-[rgba(66,58,46,0.5)]">
												<div className="text-[13px] font-medium text-[#f4efe5]">
													Book my call
												</div>
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke={C.gold}
													strokeWidth="2"
												>
													<path d="M5 12h14M12 5l7 7-7 7" />
												</svg>
											</div>
										</a>
										{/* <a
											href="/application"
											className="htc-path-card border border-[rgba(66,58,46,0.5)] rounded bg-[#0a080480] flex flex-col gap-[16px] cursor-pointer relative overflow-hidden no-underline text-inherit transition-all duration-300"
											style={{ padding: "32px 28px" }}
										>
											<div className="text-[10px] tracking-[3px] uppercase py-[4px] px-[10px] rounded-[2px] self-start bg-transparent border border-[rgba(201,168,76,0.25)] text-[#c9a84c]">
												Alternative
											</div>
											<div className="font-serif text-[24px] font-bold text-[#f4efe5] leading-[1.2]">
												Join HTC Academy
											</div>
											<div className="text-sm text-[#9a9080] leading-[1.65] font-light flex-1">
												Can&apos;t wait for a call slot? HTC Academy gets you
												started immediately. Full curriculum, live Zoom sessions
												every 2 weeks, direct path to HTC Mastery.
											</div>
											<div className="text-xs text-[#555] tracking-[2px]">
												$297 one-time · Instant access
											</div>
											<div className="flex items-center justify-between pt-[16px] border-t border-[rgba(66,58,46,0.5)]">
												<div className="text-[13px] font-medium text-[#f4efe5]">
													Join Academy
												</div>
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke={C.gold}
													strokeWidth="2"
												>
													<path d="M5 12h14M12 5l7 7-7 7" />
												</svg>
											</div>
										</a> */}
									</>
								) : qualifiesForAcademy ? (
									<>
										<a
											href="/application"
											className="htc-path-card border border-[rgba(201,168,76,0.25)] rounded flex flex-col gap-[16px] cursor-pointer relative overflow-hidden no-underline text-inherit transition-all duration-300"
											style={{
												background: "#0a080480",
												padding: "32px 28px",
											}}
										>
											<div className="text-[10px] tracking-[3px] uppercase py-[4px] px-[10px] rounded-[2px] md:self-start bg-[#c9a84c] text-[#070707]">
												Recommended — {score}/15
											</div>
											<div className="font-serif text-[24px] font-bold text-[#f4efe5] leading-[1.2]">
												Join HTC Academy
											</div>
											<div className="text-sm text-[#9a9080] leading-[1.65] font-light flex-1">
												You scored {score}/15 — solid foundations. HTC Academy
												is the right next step. Full curriculum, live Zoom
												sessions every 2 weeks where I personally coach you.
											</div>
											<div className="text-xs text-[#c9a84c] tracking-[2px]">
												$297 one-time · Instant access
											</div>
											<div className="flex items-center justify-between pt-[16px] border-t border-[rgba(66,58,46,0.5)]">
												<div className="text-[13px] font-medium text-[#f4efe5]">
													Join Academy
												</div>
												<svg
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke={C.gold}
													strokeWidth="2"
												>
													<path d="M5 12h14M12 5l7 7-7 7" />
												</svg>
											</div>
										</a>
										<div
											className="border border-[rgba(66,58,46,0.5)] rounded bg-black flex flex-col gap-[16px] opacity-[0.45] pointer-events-none"
											style={{ padding: "32px 28px" }}
										>
											<div className="text-[10px] tracking-[3px] uppercase py-[4px] px-[10px] rounded-[2px] md:self-start bg-transparent border border-[rgba(66,58,46,0.5)] text-[#555]">
												Locked
											</div>
											<div className="font-serif text-[24px] font-bold text-[#555] leading-[1.2]">
												Strategy Call
											</div>
											<div className="text-sm text-[#9a9080] leading-[1.65] font-light flex-1">
												Strategy calls are reserved for closers who score 12+.
												Get there through Academy and you&apos;ll qualify.
											</div>
											<div className="text-xs text-[#555] tracking-[2px]">
												Score 12/15 to unlock
											</div>
											<div className="pt-[16px] border-t border-[rgba(66,58,46,0.5)]">
												<div className="text-[13px] font-medium text-[#555]">
													Not yet unlocked
												</div>
											</div>
										</div>
									</>
								) : (
									<div
										className="border border-[rgba(224,85,85,0.3)] rounded bg-black flex flex-col gap-[16px]"
										style={{ padding: "32px 28px" }}
									>
										<div className="text-[10px] tracking-[3px] uppercase py-[4px] px-[10px] rounded-[2px] self-start bg-[rgba(224,85,85,0.1)] border border-[rgba(224,85,85,0.3)] text-[#e08888]">
											Score: {score}/15
										</div>
										<div className="font-serif text-[24px] font-bold text-[#f4efe5] leading-[1.2]">
											You&apos;re Not Ready Yet — And That&apos;s Okay.
										</div>
										<div className="text-sm text-[#9a9080] leading-[1.65] font-light">
											You scored {score}/15. The material is in the videos — go
											back, rewatch, and retake. The closers who succeed are the
											ones who take this seriously enough to go again.
										</div>
										<div className="pt-[16px] border-t border-[rgba(66,58,46,0.5)]">
											<div className="text-[13px] font-medium text-[#e08888]">
												Rewatch the training and retake the quizzes →
											</div>
										</div>
									</div>
								)}
							</div>

							<div
								className="htc-cert-row border border-[rgba(66,58,46,0.5)] rounded bg-[#0a080480] flex items-center gap-[28px]"
								style={{ padding: 32 }}
							>
								<div className="w-[64px] h-[64px] rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] flex items-center justify-center text-[#c9a84c] shrink-0">
									<svg
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
									>
										<path d="M12 15l-3 6 3-1.5 3 1.5-3-6z" />
										<circle cx="12" cy="8" r="6" />
									</svg>
								</div>
								<div className="flex-1">
									<div className="font-serif text-[20px] font-bold text-[#f4efe5] mb-[4px]">
										HTC Foundation Certificate
									</div>
									<div className="text-xs text-[#c9a84c] tracking-[2px] uppercase mb-[8px]">
										Awarded to: {name} — Score: {score}/15
									</div>
									<div className="text-[13px] text-[#555] leading-[1.5]">
										Certified completion of the HTC 5-Day Closer Training. Share
										it. You&apos;ve earned it.
									</div>
								</div>
								<button
									className="htc-cert-dl btn-cta-gold flex items-center gap-[8px] text-[13px] font-semibold rounded-[3px] cursor-pointer whitespace-nowrap tracking-[0.3px] transition-all duration-200"
									onClick={showCertificate}
									style={{
										fontFamily: "'DM Sans',sans-serif",
										padding: "12px 24px",
									}}
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
									</svg>
									View Certificate
								</button>
							</div>
						</div>
					) : isLocked ? (
						/* ── LOCKED DAY ── */
						<div
							className="flex flex-col items-center justify-center text-center gap-[24px]"
							style={{
								minHeight: "60vh",
								animation: "fadeUp 0.5s ease forwards",
							}}
						>
							<div className="w-[80px] h-[80px] rounded-full border border-[rgba(66,58,46,0.5)] flex items-center justify-center text-[#555]">
								<svg
									width="32"
									height="32"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<rect x="3" y="11" width="18" height="11" rx="2" />
									<path d="M7 11V7a5 5 0 0110 0v4" />
								</svg>
							</div>
							<div className="font-serif text-[40px] font-bold text-[#f4efe5]">
								Day {currentDay + 1} is Locked
							</div>
							<div className="text-base text-[#9a9080] max-w-[400px] leading-[1.6]">
								Pass the Day {currentDay} quiz to unlock this lesson.
							</div>
						</div>
					) : (
						/* ── DAY CONTENT ── */
						<>
							<div
								className="flex flex-col gap-5 mb-12 text-center md:text-left"
								style={{ animation: "fadeUp 0.6s ease forwards" }}
							>
								<div className="inline-flex mx-auto md:mx-0 items-center justify-center px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-[4px] self-start">
									<span className="text-xs tracking-[1.2px] uppercase text-white whitespace-nowrap">
										{d.eyebrow}
									</span>
								</div>
								<div className="font-serif leading-[1.13]">
									<p className="text-4xl md:text-6xl text-white">
										{d.title.split("\n")[0]}
									</p>
									<p className="text-4xl md:text-6xl text-[#f0df7a]">
										{d.title.split("\n")[1] || ""}
									</p>
								</div>
								<p className="text-lg font-light text-[#9a9a9a] leading-8 max-w-[600px]">
									{d.desc}
								</p>
							</div>

							{/* VIDEO */}
							<div
								onClick={() => !playedVideo && setPlayedVideo(true)}
								className="relative bg-black border border-[rgba(66,58,46,0.5)] rounded overflow-hidden mb-[40px]"
								style={{
									aspectRatio: "16/9",
									animation: "fadeUp 0.6s 0.1s ease both",
									cursor: playedVideo ? "default" : "pointer",
								}}
							>
								{playedVideo ? (
									<iframe
										src={d.videoUrl}
										width="100%"
										height="100%"
										frameBorder="0"
										allow="autoplay; fullscreen; picture-in-picture"
										allowFullScreen
										className="block"
									/>
								) : (
									<>
										<div
											className="absolute inset-0"
											style={{
												background:
													"linear-gradient(135deg,rgba(201,168,76,0.05) 0%,transparent 60%)",
											}}
										/>
										<div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px]">
											<div
												className="htc-play-btn w-[72px] h-[72px] rounded-full bg-[#c9a84c] flex items-center justify-center transition-all duration-200"
												style={{ boxShadow: "0 0 40px rgba(201,168,76,0.3)" }}
											>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="#070707"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
											<div className="text-xs text-[#9a9080] tracking-[2px] uppercase">
												{isDone ? "Watch Again" : `Play Day ${currentDay + 1}`}
											</div>
										</div>
										<div className="absolute bottom-[16px] right-[16px] text-xs text-[#f4efe5] bg-[rgba(0,0,0,0.7)] py-[4px] px-[10px] rounded-[3px]">
											{d.duration}
										</div>
									</>
								)}
							</div>

							{/* LESSONS */}
							<div
								className="flex flex-col gap-7 mb-12"
								style={{ animation: "fadeUp 0.6s 0.2s ease both" }}
							>
								<p className="text-xs tracking-[1.2px] uppercase text-[#9a9a9a]">
									What You&apos;ll Learn
								</p>
								<div className="flex flex-col gap-5">
									{d.lessons.map((l, i) => (
										<div key={i} className="flex gap-5 items-start">
											<div
												className="shrink-0 size-[60px] rounded-sm border border-[rgba(255,255,255,0.2)] flex items-center justify-center"
												style={{
													background:
														"linear-gradient(180deg, rgba(99,99,99,0.2) 20%, transparent 100%), radial-gradient(ellipse 100% 80% at 50% 120%, rgba(201,165,114,0.5) 0%, transparent 70%)",
												}}
											>
												<span className="font-bold text-base text-white tracking-[1.6px]">
													0{i + 1}
												</span>
											</div>
											<div className="flex flex-col gap-1 pt-1">
												<p className="text-base text-white capitalize">
													{l.title}
												</p>
												<p className="text-sm font-light text-[#9a9a9a]">
													{l.desc}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* QUIZ */}
							<div
								className="rounded-sm border border-[rgba(66,58,46,0.5)] md:py-8 md:px-8 py-6 px-6 mt-[48px]"
								style={{
									animation: "fadeUp 0.5s ease forwards",
									background: "rgba(10,8,4,0.5)",
									backdropFilter: "blur(12px) saturate(1.4)",
									WebkitBackdropFilter: "blur(12px) saturate(1.4)",
								}}
							>
								<div className="flex items-center justify-between mb-[28px] flex-wrap gap-[12px]">
									<div className="text-[10px] text-[#c9a84c] tracking-[4px] uppercase flex items-center gap-[10px]">
										<span
											className="inline-block h-px bg-[#c9a84c]"
											style={{ width: 16 }}
										/>
										Day {currentDay + 1} Quiz
									</div>
									{isDone ? (
										<div className="text-xs text-[#c9a84c] tracking-[2px] flex items-center gap-[6px]">
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path d="M20 6L9 17l-5-5" />
											</svg>
											Passed
										</div>
									) : (
										<div className="text-xs text-[#555] tracking-[2px]">
											2/3 correct to unlock{" "}
											<span className="text-[#c9a84c]">
												Day {currentDay < 4 ? currentDay + 2 : "results"}
											</span>
										</div>
									)}
								</div>

								{isDone ? (
									<div className="flex flex-col items-center justify-center">
										<div className="text-xs text-[#555] tracking-[2px] p-[20px] text-center">
											Quiz complete — day unlocked.
										</div>
										{currentDay === 4 && (
											<button
												className="htc-unlock btn-cta-gold inline-flex items-center gap-[10px] text-sm font-semibold rounded-[3px] cursor-pointer tracking-[0.3px] mt-[8px] transition-all duration-200 md:w-auto w-full justify-center md:justify-start"
												style={{
													fontFamily: "'DM Sans',sans-serif",
													padding: "12px 24px",
												}}
												onClick={triggerCompletion}
											>
												See Your Results{" "}
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M5 12h14M12 5l7 7-7 7" />
												</svg>
											</button>
										)}
									</div>
								) : (
									<>
										<div className="flex flex-col gap-[28px]">
											{d.quiz.map((q, qi) => {
												return (
													<div key={qi} className="flex flex-col gap-[14px]">
														<div className="text-base font-medium text-[#f4efe5] leading-[1.5] flex gap-[12px]">
															<span className="text-sm text-[#c9a84c] tracking-[2px] min-w-[20px] pt-[1px]">
																Q{qi + 1}
															</span>
															<span>{q.q}</span>
														</div>
														<div className="flex flex-col gap-[8px] md:pl-[32px]">
															{q.opts.map((opt, oi) => {
																const isSelected = answers[qi] === oi;
																let bg = "transparent",
																	border = C.border,
																	color = C.text,
																	keyBg = C.border,
																	keyColor = C.muted;
																if (submitted && isSelected) {
																	bg = "rgba(255,255,255,0.04)";
																	border = "rgba(255,255,255,0.15)";
																	color = C.white;
																	keyBg = "rgba(255,255,255,0.15)";
																	keyColor = C.white;
																} else if (!submitted && isSelected) {
																	bg = C.goldDim;
																	border = C.gold;
																	color = C.white;
																	keyBg = C.gold;
																	keyColor = C.black;
																}
																return (
																	<button
																		key={oi}
																		disabled={submitted}
																		onClick={() =>
																			selectAnswer(currentDay, qi, oi)
																		}
																		className="rounded-[3px] text-left w-full"
																		style={{
																			display: "flex",
																			alignItems: "center",
																			gap: 12,
																			padding: "13px 16px",
																			border: `1px solid ${border}`,
																			cursor: submitted ? "default" : "pointer",
																			background: bg,
																			color,
																			fontFamily: "'DM Sans',sans-serif",
																			fontSize: 14,
																			transition: "all 0.18s",
																		}}
																	>
																		<span
																			className="rounded-[2px] min-w-[24px] text-center shrink-0"
																			style={{
																				fontSize: 10,
																				background: keyBg,
																				color: keyColor,
																				padding: "2px 7px",
																				transition: "all 0.18s",
																			}}
																		>
																			{KEYS[oi]}
																		</span>
																		{opt}
																	</button>
																);
															})}
														</div>
													</div>
												);
											})}
										</div>

										{!submitted ? (
											<div className="justify-end items-end flex flex-col gap-[8px] mt-5">
												<button
													className="htc-submit btn-cta-gold inline-flex items-center gap-[12px] text-sm font-semibold min-w-[214px] rounded-[3px] tracking-[0.3px] justify-center transition-all duration-200"
													style={{
														fontFamily: "'DM Sans',sans-serif",
														padding: "15px 32px",
														cursor: allAnswered ? "pointer" : "not-allowed",
														opacity: allAnswered ? 1 : 0.4,
													}}
													onClick={submitQuiz}
												>
													Submit Quiz{" "}
													<svg
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2.5"
													>
														<path d="M5 12h14M12 5l7 7-7 7" />
													</svg>
												</button>
												<div className="text-xs text-[#555] tracking-[1px]">
													Answer all 3 questions to submit
												</div>
											</div>
										) : (
											<div
												className="text-center md:text-left flex md:flex-row flex-col rounded-[3px] mt-5 items-center gap-[16px]"
												style={{
													padding: "20px 24px",
													background: "rgba(255,255,255,0.03)",
													border: "1px solid rgba(255,255,255,0.08)",
												}}
											>
												<div className="flex-1">
													<div className="text-base font-semibold mb-[4px] text-[#f4efe5]">
														{(() => {
															const dayAnswers = quizAnswers[currentDay] || {};
															const correct = d.quiz.reduce(
																(n, q, qi) =>
																	n + (dayAnswers[qi] === q.correct ? 1 : 0),
																0,
															);
															return `${correct}/3`;
														})()}
													</div>
													<div className="text-[13px] text-[#555] leading-[1.5] tracking-[0.5px]">
														{passed
															? currentDay < 4
																? `Day ${currentDay + 2} is now unlocked.`
																: "All 5 days complete."
															: "You need 2/3 to pass. Rewatch the video and try again."}
													</div>
												</div>

												<div className="flex-1 md:flex-none shrink-0">
													{passed ? (
														<button
															className="htc-unlock btn-cta-gold inline-flex items-center gap-[10px] text-sm font-semibold rounded-[3px] cursor-pointer tracking-[0.3px] transition-all duration-200"
															style={{
																fontFamily: "'DM Sans',sans-serif",
																padding: "12px 24px",
															}}
															onClick={() =>
																currentDay < 4
																	? goToDay(currentDay + 1)
																	: triggerCompletion()
															}
														>
															{currentDay < 4
																? `Go to Day ${currentDay + 2}`
																: "See Your Results"}
															<svg
																width="14"
																height="14"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
															>
																<path d="M5 12h14M12 5l7 7-7 7" />
															</svg>
														</button>
													) : (
														<button
															className="htc-retry inline-flex items-center gap-[8px] bg-transparent border border-[rgba(255,255,255,0.15)] text-[#9a9a9a] text-[13px] font-medium rounded-[3px] cursor-pointer transition-all duration-200"
															onClick={retakeQuiz}
															style={{
																fontFamily: "'DM Sans',sans-serif",
																padding: "10px 20px",
															}}
														>
															<svg
																width="13"
																height="13"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2"
															>
																<path d="M1 4v6h6M23 20v-6h-6" />
																<path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
															</svg>
															Retake Quiz
														</button>
													)}
												</div>
											</div>
										)}
									</>
								)}
							</div>

							{/* PREV / NEXT NAV */}
							<div
								className={`flex items-center justify-between pt-4 relative ${currentDay > 0 && currentDay < unlockedDays - 1 ? "gap-4" : ""}`}
							>
								{currentDay > 0 ? (
									<button
										onClick={() => goToDay(currentDay - 1)}
										className="inline-flex flex-1 md:flex-[0] items-center gap-[10px] border border-[#f7e28064] min-w-[120px] justify-center text-white text-[13px] font-medium rounded-[3px] cursor-pointer transition-all duration-200 hover:text-[#f7e280]"
										style={{
											fontFamily: "'DM Sans',sans-serif",
											padding: "12px 20px",
										}}
									>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M19 12H5M12 19l-7-7 7-7" />
										</svg>
										Day {currentDay}
									</button>
								) : (
									<div />
								)}
								{currentDay < unlockedDays - 1 ? (
									<button
										onClick={() => goToDay(currentDay + 1)}
										className="inline-flex flex-1 md:flex-[0] items-center gap-[10px] border border-[#f7e28064] min-w-[120px] justify-center text-white text-[13px] font-medium rounded-[3px] cursor-pointer transition-all duration-200 hover:text-[#f7e280]"
										style={{
											fontFamily: "'DM Sans',sans-serif",
											padding: "12px 20px",
										}}
									>
										Day {currentDay + 2}
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</button>
								) : (
									<div />
								)}
							</div>
						</>
					)}
				</div>
			</main>

			{/* TOAST */}
			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="fixed bottom-[32px] right-[32px] bg-black border border-[rgba(201,168,76,0.25)] rounded max-w-[360px] flex items-center gap-[14px] pointer-events-none z-[999]"
				style={{
					padding: "16px 24px",
					transform: toastVisible ? "translateY(0)" : "translateY(100px)",
					opacity: toastVisible ? 1 : 0,
					transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
				}}
			>
				<div className="text-[#c9a84c] shrink-0">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
					</svg>
				</div>
				<div
					className="text-sm text-[#f4efe5] leading-[1.4]"
					dangerouslySetInnerHTML={{ __html: toastMsg }}
				/>
			</div>

			{/* RECOVERY MODAL */}
			{recoveryOpen && (
				<div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[2000] flex items-center justify-center">
					<div
						className="bg-black border border-[rgba(201,168,76,0.25)] rounded-lg w-full max-w-[620px] relative"
						style={{ padding: 32 }}
					>
						<button
							onClick={() => setRecoveryOpen(false)}
							className="absolute top-[16px] right-[16px] bg-transparent border-none text-[#555] cursor-pointer text-[20px] leading-none"
						>
							×
						</button>
						<div className="text-lg text-white mb-2 text-center">
							Lost Your Link?
						</div>
						<div className="text-base text-[#9a9080] text-center mb-4">
							Enter the email you signed up with and we&apos;ll send it right
							back to you.
						</div>
						<iframe
							src="https://api.leadconnectorhq.com/widget/form/zyjRC6a660piFavW9EwB"
							className="w-full rounded border-none"
							style={{ height: 249, borderRadius: 4 }}
							title="HTC Link Recovery"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default function TrainingPortal() {
	return (
		<Suspense fallback={<div className="bg-[#070707] min-h-screen" />}>
			<Portal />
		</Suspense>
	);
}
