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
	const [certActive, setCertActive] = useState(false);
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
		setCertActive(true);
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
		const certHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>HTC Certificate</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400&family=DM+Mono:wght@400&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#070707;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px;font-family:'DM Sans',sans-serif}.cert{background:#0d0a00;border:1px solid rgba(201,168,76,0.4);max-width:760px;width:100%;padding:72px 80px;position:relative;text-align:center}.cert::before,.cert::after{content:'';position:absolute;width:60px;height:60px;border-color:rgba(201,168,76,0.3);border-style:solid}.cert::before{top:16px;left:16px;border-width:1px 0 0 1px}.cert::after{bottom:16px;right:16px;border-width:0 1px 1px 0}.logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:#c9a84c;letter-spacing:4px;margin-bottom:40px}.presents{font-family:'DM Mono',monospace;font-size:10px;color:#555;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px}.name{font-family:'Playfair Display',serif;font-size:40px;font-style:italic;color:#c9a84c;margin-bottom:16px}.title{font-family:'Playfair Display',serif;font-size:48px;font-weight:900;color:#f4efe5;line-height:1.05;margin-bottom:8px}.title em{font-style:italic;color:#c9a84c}.divider{width:60px;height:1px;background:rgba(201,168,76,0.4);margin:32px auto}.score{font-family:'DM Mono',monospace;font-size:12px;color:#555;letter-spacing:3px;margin-bottom:24px}.score span{color:#c9a84c}.body{font-size:15px;color:#9a9080;line-height:1.7;max-width:480px;margin:0 auto 48px;font-weight:300}.footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:40px;border-top:1px solid #1c1c1c}.sig-name{font-family:'Playfair Display',serif;font-size:20px;font-style:italic;color:#f4efe5}.sig-role{font-family:'DM Mono',monospace;font-size:10px;color:#555;letter-spacing:3px;text-transform:uppercase;margin-top:4px}.date{font-family:'DM Mono',monospace;font-size:10px;color:#555;letter-spacing:2px}</style></head><body><div class="cert"><div class="logo">HTC</div><div class="presents">High Ticket Consulting — Certifies That</div><div class="name">${name}</div><div class="title">HTC <em>Foundation</em><br>Certificate</div><div class="divider"></div><div class="score">Quiz Score: <span>${totalScore} / 15</span></div><div class="body">Has successfully completed the HTC 5-Day Closer Training — demonstrating commitment, discipline, and the foundational knowledge required to operate as a high-ticket remote closer.</div><div class="footer"><div><div class="sig-name">Bruno Bajrami</div><div class="sig-role">Founder, High Ticket Consulting</div></div><div class="date">${today}</div></div></div></body></html>`;
		const win = window.open("", "_blank");
		if (win) {
			win.document.write(certHTML);
			win.document.close();
		}
	};

	const d = DAYS[currentDay];
	const isLocked = currentDay >= unlockedDays;
	const isDone = currentDay < completedDays;
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
		<div
			style={{
				background: C.black,
				minHeight: "100vh",
				display: "flex",
			}}
		>
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
				className="htc-main relative"
				style={{
					marginLeft: 300,
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					flex: 1,
				}}
			>
				{/* TOPBAR */}
				<TrainingNav
					name={name}
					certActive={certActive}
					onShowCertificate={showCertificate}
				/>

				{/* CONTENT */}
				<div
					className="htc-content"
					style={{ flex: 1, padding: "56px 48px", maxWidth: 900 }}
				>
					<div
						className="absolute inset-0 opacity-50 z-0"
						style={{
							backgroundImage: "url(/images/middle.webp)",
							backgroundPosition: "center center",
							backgroundRepeat: "no-repeat",
							backgroundSize: "cover",
						}}
					></div>
					{/* ── COMPLETION SCREEN ── */}
					{showCompletion ? (
						<div style={{ animation: "fadeUp 0.7s ease forwards" }}>
							<div
								style={{
									background:
										"linear-gradient(135deg,#0d0a00 0%,#111008 50%,#0a0a0a 100%)",
									border: `1px solid ${C.borderGold}`,
									borderRadius: 4,
									padding: "56px 48px",
									position: "relative",
									overflow: "hidden",
									marginBottom: 40,
								}}
							>
								<div
									style={{
										fontSize: 10,
										color: C.gold,
										letterSpacing: 5,
										textTransform: "uppercase",
										marginBottom: 24,
										display: "flex",
										alignItems: "center",
										gap: 12,
									}}
								>
									<span
										style={{
											display: "inline-block",
											width: 20,
											height: 1,
											background: C.gold,
										}}
									/>
									Training Complete
								</div>
								<div
									style={{
										fontFamily: "'Playfair Display',serif",
										fontSize: "clamp(40px,6vw,64px)",
										fontWeight: 900,
										lineHeight: 1,
										color: C.white,
										marginBottom: 20,
									}}
								>
									You&apos;ve done what
									<br />
									<em style={{ fontStyle: "italic", color: C.gold }}>
										99% of people won&apos;t.
									</em>
								</div>
								<div
									style={{
										fontSize: 16,
										color: C.text,
										lineHeight: 1.75,
										maxWidth: 520,
										fontWeight: 300,
									}}
								>
									Most people who found this training never finished Day 1. You
									just finished all 5 — and proved you actually paid attention.
									That tells me everything I need to know about you, {name}.
								</div>
								<div
									style={{
										display: "flex",
										gap: 40,
										marginTop: 36,
										paddingTop: 36,
										borderTop: `1px solid ${C.border}`,
										flexWrap: "wrap",
									}}
								>
									<div>
										<div
											style={{
												fontFamily: "'Playfair Display',serif",
												fontSize: 32,
												fontWeight: 700,
												color: C.gold,
												lineHeight: 1,
											}}
										>
											5
										</div>
										<div
											style={{
												fontSize: 10,
												color: C.muted,
												letterSpacing: 3,
												textTransform: "uppercase",
												marginTop: 6,
											}}
										>
											Days Completed
										</div>
									</div>
									<div>
										<div
											style={{
												fontFamily: "'Playfair Display',serif",
												fontSize: 32,
												fontWeight: 700,
												color: scoreColor,
												lineHeight: 1,
											}}
										>
											{score}/15
										</div>
										<div
											style={{
												fontSize: 10,
												color: C.muted,
												letterSpacing: 3,
												textTransform: "uppercase",
												marginTop: 6,
											}}
										>
											Quiz Score
										</div>
									</div>
									<div>
										<div
											style={{
												fontFamily: "'Playfair Display',serif",
												fontSize: 18,
												fontWeight: 700,
												color: scoreColor,
												lineHeight: 1,
												paddingTop: 6,
											}}
										>
											{scoreLabel}
										</div>
										<div
											style={{
												fontSize: 10,
												color: C.muted,
												letterSpacing: 3,
												textTransform: "uppercase",
												marginTop: 6,
											}}
										>
											Your Status
										</div>
									</div>
								</div>
							</div>

							<div
								style={{
									fontSize: 10,
									color: C.muted,
									letterSpacing: 4,
									textTransform: "uppercase",
									marginBottom: 20,
									display: "flex",
									alignItems: "center",
									gap: 16,
								}}
							>
								Your Next Move — Based on Your Score
								<span
									style={{
										flex: 1,
										height: 1,
										background: C.border,
										display: "block",
									}}
								/>
							</div>

							<div
								className="htc-paths-grid"
								style={{
									display: "grid",
									gridTemplateColumns:
										qualifiesForCall || qualifiesForAcademy ? "1fr 1fr" : "1fr",
									gap: 16,
									marginBottom: 48,
								}}
							>
								{qualifiesForCall ? (
									<>
										<a
											href="/booking"
											className="htc-path-card"
											style={{
												border: `1px solid ${C.borderGold}`,
												borderRadius: 4,
												padding: "32px 28px",
												display: "flex",
												flexDirection: "column",
												gap: 16,
												cursor: "pointer",
												background:
													"linear-gradient(135deg,#131108 0%,#111111 100%)",
												textDecoration: "none",
												color: "inherit",
												transition: "all 0.3s",
												position: "relative",
												overflow: "hidden",
											}}
										>
											<div
												style={{
													fontSize: 9,
													letterSpacing: 3,
													textTransform: "uppercase",
													padding: "4px 10px",
													borderRadius: 2,
													alignSelf: "flex-start",
													background: C.gold,
													color: C.black,
												}}
											>
												You Qualified — {score}/15
											</div>
											<div
												style={{
													fontFamily: "'Playfair Display',serif",
													fontSize: 24,
													fontWeight: 700,
													color: C.white,
													lineHeight: 1.2,
												}}
											>
												Book a Free Strategy Call
											</div>
											<div
												style={{
													fontSize: 14,
													color: C.text,
													lineHeight: 1.65,
													fontWeight: 300,
													flex: 1,
												}}
											>
												You scored {score}/15. That puts you in the top tier. I
												take 5 strategy calls a week — I&apos;ll personally map
												out your next 90 days, your offer, your income targets.
												This is reserved for people who prove they&apos;re
												serious. You did.
											</div>
											<div
												style={{
													fontSize: 12,
													color: C.gold,
													letterSpacing: 2,
												}}
											>
												Free · 45 minutes · Limited to 5 spots/week
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													paddingTop: 16,
													borderTop: `1px solid ${C.border}`,
												}}
											>
												<div
													style={{
														fontSize: 13,
														fontWeight: 500,
														color: C.white,
													}}
												>
													Book my call →
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
										<a
											href="/apply"
											className="htc-path-card"
											style={{
												border: `1px solid ${C.border}`,
												borderRadius: 4,
												padding: "32px 28px",
												display: "flex",
												flexDirection: "column",
												gap: 16,
												cursor: "pointer",
												background: C.card,
												textDecoration: "none",
												color: "inherit",
												transition: "all 0.3s",
												position: "relative",
												overflow: "hidden",
											}}
										>
											<div
												style={{
													fontSize: 9,
													letterSpacing: 3,
													textTransform: "uppercase",
													padding: "4px 10px",
													borderRadius: 2,
													alignSelf: "flex-start",
													background: "transparent",
													border: `1px solid ${C.borderGold}`,
													color: C.gold,
												}}
											>
												Alternative
											</div>
											<div
												style={{
													fontFamily: "'Playfair Display',serif",
													fontSize: 24,
													fontWeight: 700,
													color: C.white,
													lineHeight: 1.2,
												}}
											>
												Join HTC Academy
											</div>
											<div
												style={{
													fontSize: 14,
													color: C.text,
													lineHeight: 1.65,
													fontWeight: 300,
													flex: 1,
												}}
											>
												Can&apos;t wait for a call slot? HTC Academy gets you
												started immediately. Full curriculum, live Zoom sessions
												every 2 weeks, direct path to HTC Mastery.
											</div>
											<div
												style={{
													fontSize: 12,
													color: C.muted,
													letterSpacing: 2,
												}}
											>
												$297 one-time · Instant access
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													paddingTop: 16,
													borderTop: `1px solid ${C.border}`,
												}}
											>
												<div
													style={{
														fontSize: 13,
														fontWeight: 500,
														color: C.white,
													}}
												>
													Join Academy →
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
									</>
								) : qualifiesForAcademy ? (
									<>
										<a
											href="/apply"
											className="htc-path-card"
											style={{
												border: `1px solid ${C.borderGold}`,
												borderRadius: 4,
												padding: "32px 28px",
												display: "flex",
												flexDirection: "column",
												gap: 16,
												cursor: "pointer",
												background:
													"linear-gradient(135deg,#131108 0%,#111111 100%)",
												textDecoration: "none",
												color: "inherit",
												transition: "all 0.3s",
												position: "relative",
												overflow: "hidden",
											}}
										>
											<div
												style={{
													fontSize: 9,
													letterSpacing: 3,
													textTransform: "uppercase",
													padding: "4px 10px",
													borderRadius: 2,
													alignSelf: "flex-start",
													background: C.gold,
													color: C.black,
												}}
											>
												Recommended — {score}/15
											</div>
											<div
												style={{
													fontFamily: "'Playfair Display',serif",
													fontSize: 24,
													fontWeight: 700,
													color: C.white,
													lineHeight: 1.2,
												}}
											>
												Join HTC Academy
											</div>
											<div
												style={{
													fontSize: 14,
													color: C.text,
													lineHeight: 1.65,
													fontWeight: 300,
													flex: 1,
												}}
											>
												You scored {score}/15 — solid foundations. HTC Academy
												is the right next step. Full curriculum, live Zoom
												sessions every 2 weeks where I personally coach you.
											</div>
											<div
												style={{
													fontSize: 12,
													color: C.gold,
													letterSpacing: 2,
												}}
											>
												$297 one-time · Instant access
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													paddingTop: 16,
													borderTop: `1px solid ${C.border}`,
												}}
											>
												<div
													style={{
														fontSize: 13,
														fontWeight: 500,
														color: C.white,
													}}
												>
													Join Academy →
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
											style={{
												border: `1px solid ${C.border}`,
												borderRadius: 4,
												padding: "32px 28px",
												display: "flex",
												flexDirection: "column",
												gap: 16,
												background: C.card,
												opacity: 0.45,
												pointerEvents: "none",
											}}
										>
											<div
												style={{
													fontSize: 9,
													letterSpacing: 3,
													textTransform: "uppercase",
													padding: "4px 10px",
													borderRadius: 2,
													alignSelf: "flex-start",
													background: "transparent",
													border: `1px solid ${C.border}`,
													color: C.muted,
												}}
											>
												Locked
											</div>
											<div
												style={{
													fontFamily: "'Playfair Display',serif",
													fontSize: 24,
													fontWeight: 700,
													color: C.muted,
													lineHeight: 1.2,
												}}
											>
												Strategy Call
											</div>
											<div
												style={{
													fontSize: 14,
													color: C.text,
													lineHeight: 1.65,
													fontWeight: 300,
													flex: 1,
												}}
											>
												Strategy calls are reserved for closers who score 12+.
												Get there through Academy and you&apos;ll qualify.
											</div>
											<div
												style={{
													fontSize: 12,
													color: C.muted,
													letterSpacing: 2,
												}}
											>
												Score 12/15 to unlock
											</div>
											<div
												style={{
													paddingTop: 16,
													borderTop: `1px solid ${C.border}`,
												}}
											>
												<div
													style={{
														fontSize: 13,
														fontWeight: 500,
														color: C.muted,
													}}
												>
													Not yet unlocked
												</div>
											</div>
										</div>
									</>
								) : (
									<div
										style={{
											border: "1px solid rgba(224,85,85,0.3)",
											borderRadius: 4,
											padding: "32px 28px",
											display: "flex",
											flexDirection: "column",
											gap: 16,
											background: C.card,
										}}
									>
										<div
											style={{
												fontSize: 9,
												letterSpacing: 3,
												textTransform: "uppercase",
												padding: "4px 10px",
												borderRadius: 2,
												alignSelf: "flex-start",
												background: "rgba(224,85,85,0.1)",
												border: "1px solid rgba(224,85,85,0.3)",
												color: "#e08888",
											}}
										>
											Score: {score}/15
										</div>
										<div
											style={{
												fontFamily: "'Playfair Display',serif",
												fontSize: 24,
												fontWeight: 700,
												color: C.white,
												lineHeight: 1.2,
											}}
										>
											You&apos;re Not Ready Yet — And That&apos;s Okay.
										</div>
										<div
											style={{
												fontSize: 14,
												color: C.text,
												lineHeight: 1.65,
												fontWeight: 300,
											}}
										>
											You scored {score}/15. The material is in the videos — go
											back, rewatch, and retake. The closers who succeed are the
											ones who take this seriously enough to go again.
										</div>
										<div
											style={{
												paddingTop: 16,
												borderTop: `1px solid ${C.border}`,
											}}
										>
											<div
												style={{
													fontSize: 13,
													fontWeight: 500,
													color: "#e08888",
												}}
											>
												Rewatch the training and retake the quizzes →
											</div>
										</div>
									</div>
								)}
							</div>

							<div
								className="htc-cert-row"
								style={{
									border: `1px solid ${C.border}`,
									borderRadius: 4,
									padding: 32,
									background: C.card,
									display: "flex",
									alignItems: "center",
									gap: 28,
								}}
							>
								<div
									style={{
										width: 64,
										height: 64,
										borderRadius: "50%",
										border: `1px solid ${C.borderGold}`,
										background: C.goldDim,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: C.gold,
										flexShrink: 0,
									}}
								>
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
								<div style={{ flex: 1 }}>
									<div
										style={{
											fontFamily: "'Playfair Display',serif",
											fontSize: 20,
											fontWeight: 700,
											color: C.white,
											marginBottom: 4,
										}}
									>
										HTC Foundation Certificate
									</div>
									<div
										style={{
											fontSize: 12,
											color: C.gold,
											letterSpacing: 2,
											textTransform: "uppercase",
											marginBottom: 8,
										}}
									>
										Awarded to: {name} — Score: {score}/15
									</div>
									<div
										style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}
									>
										Certified completion of the HTC 5-Day Closer Training. Share
										it. You&apos;ve earned it.
									</div>
								</div>
								<button
									className="htc-cert-dl btn-cta-gold"
									style={{
										display: "flex",
										alignItems: "center",
										gap: 8,
										fontFamily: "'DM Sans',sans-serif",
										fontSize: 13,
										fontWeight: 600,
										padding: "12px 24px",
										borderRadius: 3,
										cursor: "pointer",
										whiteSpace: "nowrap",
										letterSpacing: "0.3px",
										transition: "all 0.2s",
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
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center",
								minHeight: "60vh",
								gap: 24,
								animation: "fadeUp 0.5s ease forwards",
							}}
						>
							<div
								style={{
									width: 80,
									height: 80,
									borderRadius: "50%",
									border: `1px solid ${C.border}`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: C.muted,
								}}
							>
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
							<div
								style={{
									fontFamily: "'Playfair Display',serif",
									fontSize: 40,
									fontWeight: 700,
									color: C.white,
								}}
							>
								Day {currentDay + 1} is Locked
							</div>
							<div
								style={{
									fontSize: 16,
									color: C.text,
									maxWidth: 400,
									lineHeight: 1.6,
								}}
							>
								Pass the Day {currentDay} quiz to unlock this lesson.
							</div>
						</div>
					) : (
						/* ── DAY CONTENT ── */
						<>
							<div
								className="flex flex-col gap-5 mb-12"
								style={{ animation: "fadeUp 0.6s ease forwards" }}
							>
								<div className="inline-flex items-center justify-center px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-[4px] self-start">
									<span className="text-[12px] tracking-[1.2px] uppercase text-white whitespace-nowrap">
										{d.eyebrow}
									</span>
								</div>
								<div className="font-serif leading-[1.13]">
									<p className="text-[clamp(36px,5vw,60px)] text-white">
										{d.title.split("\n")[0]}
									</p>
									<p className="text-[clamp(36px,5vw,60px)] text-[#f0df7a]">
										{d.title.split("\n")[1] || ""}
									</p>
								</div>
								<p className="text-[18px] font-light text-[#9a9a9a] leading-8 max-w-[600px]">
									{d.desc}
								</p>
							</div>

							{/* VIDEO */}
							<div
								onClick={() => !playedVideo && setPlayedVideo(true)}
								style={{
									position: "relative",
									background: C.card,
									border: `1px solid ${C.border}`,
									borderRadius: 4,
									overflow: "hidden",
									aspectRatio: "16/9",
									marginBottom: 40,
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
										style={{ display: "block" }}
									/>
								) : (
									<>
										<div
											style={{
												position: "absolute",
												inset: 0,
												background:
													"linear-gradient(135deg,rgba(201,168,76,0.05) 0%,transparent 60%)",
											}}
										/>
										<div
											style={{
												position: "absolute",
												inset: 0,
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "center",
												gap: 16,
											}}
										>
											<div
												className="htc-play-btn"
												style={{
													width: 72,
													height: 72,
													borderRadius: "50%",
													background: C.gold,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													boxShadow: "0 0 40px rgba(201,168,76,0.3)",
													transition: "all 0.2s",
												}}
											>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="#070707"
													style={{ marginLeft: 4 }}
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
											<div
												style={{
													fontSize: 12,
													color: C.text,
													letterSpacing: 2,
													textTransform: "uppercase",
												}}
											>
												{isDone ? "Watch Again" : `Play Day ${currentDay + 1}`}
											</div>
										</div>
										<div
											style={{
												position: "absolute",
												bottom: 16,
												right: 16,
												fontSize: 12,
												color: C.white,
												background: "rgba(0,0,0,0.7)",
												padding: "4px 10px",
												borderRadius: 3,
											}}
										>
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
								<p className="text-[12px] tracking-[1.2px] uppercase text-[#9a9a9a]">
									What You&apos;ll Learn
								</p>
								<div className="flex flex-col gap-5">
									{d.lessons.map((l, i) => (
										<div key={i} className="flex gap-5 items-start">
											<div
												className="shrink-0 size-[80px] rounded-[32px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center"
												style={{
													background:
														"linear-gradient(180deg, rgba(99,99,99,0.2) 20%, transparent 100%), radial-gradient(ellipse 100% 80% at 50% 120%, rgba(201,165,114,0.5) 0%, transparent 70%)",
												}}
											>
												<span className="font-bold text-[16px] text-white tracking-[1.6px]">
													0{i + 1}
												</span>
											</div>
											<div className="flex flex-col gap-3 pt-4">
												<p className="text-[16px] text-white capitalize">
													{l.title}
												</p>
												<p className="text-[14px] font-light text-[#9a9a9a]">
													{l.desc}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* QUIZ */}
							<div
								className="rounded-sm border border-[rgba(66,58,46,0.5)] py-8 px-8"
								style={{
									marginTop: 48,
									animation: "fadeUp 0.5s ease forwards",
									background: "rgba(10,8,4,0.5)",
									backdropFilter: "blur(12px) saturate(1.4)",
									WebkitBackdropFilter: "blur(12px) saturate(1.4)",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: 28,
										flexWrap: "wrap",
										gap: 12,
									}}
								>
									<div
										style={{
											fontSize: 10,
											color: C.gold,
											letterSpacing: 4,
											textTransform: "uppercase",
											display: "flex",
											alignItems: "center",
											gap: 10,
										}}
									>
										<span
											style={{
												display: "inline-block",
												width: 16,
												height: 1,
												background: C.gold,
											}}
										/>
										Day {currentDay + 1} Quiz
									</div>
									{isDone ? (
										<div
											style={{
												fontSize: 12,
												color: C.gold,
												letterSpacing: 2,
												display: "flex",
												alignItems: "center",
												gap: 6,
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
												<path d="M20 6L9 17l-5-5" />
											</svg>
											Passed
										</div>
									) : (
										<div
											style={{
												fontSize: 12,
												color: C.muted,
												letterSpacing: 2,
											}}
										>
											2/3 correct to unlock{" "}
											<span style={{ color: C.gold }}>
												Day {currentDay < 4 ? currentDay + 2 : "results"}
											</span>
										</div>
									)}
								</div>

								{isDone ? (
									<div>
										<div
											style={{
												fontSize: 12,
												color: C.muted,
												letterSpacing: 2,
												padding: "20px",
												textAlign: "center",
											}}
										>
											Quiz complete — day unlocked.
										</div>
										{currentDay === 4 && (
											<button
												className="htc-unlock btn-cta-gold"
												style={{
													display: "inline-flex",
													alignItems: "center",
													gap: 10,
													fontFamily: "'DM Sans',sans-serif",
													fontSize: 14,
													fontWeight: 600,
													padding: "12px 24px",
													borderRadius: 3,
													cursor: "pointer",
													letterSpacing: "0.3px",
													marginTop: 8,
													transition: "all 0.2s",
												}}
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
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												gap: 28,
												marginBottom: 32,
											}}
										>
											{d.quiz.map((q, qi) => {
												return (
													<div
														key={qi}
														style={{
															display: "flex",
															flexDirection: "column",
															gap: 14,
														}}
													>
														<div
															style={{
																fontSize: 16,
																fontWeight: 500,
																color: C.white,
																lineHeight: 1.5,
																display: "flex",
																gap: 12,
															}}
														>
															<span
																style={{
																	fontSize: 12,
																	color: C.gold,
																	letterSpacing: 2,
																	minWidth: 20,
																	paddingTop: 2,
																}}
															>
																Q{qi + 1}
															</span>
															<span>{q.q}</span>
														</div>
														<div
															style={{
																display: "flex",
																flexDirection: "column",
																gap: 8,
																paddingLeft: 32,
															}}
														>
															{q.opts.map((opt, oi) => {
																const isSelected = answers[qi] === oi;
																let bg = "transparent",
																	border = C.border,
																	color = C.text,
																	keyBg = C.border,
																	keyColor = C.muted;
																if (submitted) {
																	if (answers[qi] === oi && oi === q.correct) {
																		bg = "rgba(76,175,125,0.1)";
																		border = "#4caf7d";
																		color = "#7ed4a8";
																		keyBg = "#4caf7d";
																		keyColor = C.black;
																	} else if (answers[qi] === oi) {
																		bg = "rgba(224,85,85,0.08)";
																		border = "#e05555";
																		color = "#e08888";
																		keyBg = "#e05555";
																		keyColor = C.white;
																	} else if (oi === q.correct) {
																		bg = "rgba(76,175,125,0.06)";
																		border = "#4caf7d";
																		color = "#7ed4a8";
																		keyBg = "#4caf7d";
																		keyColor = C.black;
																	}
																} else if (isSelected) {
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
																		style={{
																			display: "flex",
																			alignItems: "center",
																			gap: 12,
																			padding: "13px 16px",
																			border: `1px solid ${border}`,
																			borderRadius: 3,
																			cursor: submitted ? "default" : "pointer",
																			background: bg,
																			color,
																			fontFamily: "'DM Sans',sans-serif",
																			fontSize: 14,
																			textAlign: "left",
																			transition: "all 0.18s",
																			width: "100%",
																		}}
																	>
																		<span
																			style={{
																				fontSize: 10,
																				background: keyBg,
																				color: keyColor,
																				padding: "2px 7px",
																				borderRadius: 2,
																				minWidth: 24,
																				textAlign: "center",
																				transition: "all 0.18s",
																				flexShrink: 0,
																			}}
																		>
																			{KEYS[oi]}
																		</span>
																		{opt}
																	</button>
																);
															})}
														</div>
														{submitted && (
															<div
																style={{
																	padding: "14px 18px",
																	borderRadius: 3,
																	fontSize: 13,
																	lineHeight: 1.5,
																	marginTop: 4,
																	letterSpacing: "0.5px",
																	...(answers[qi] === q.correct
																		? {
																				background: "rgba(76,175,125,0.08)",
																				border:
																					"1px solid rgba(76,175,125,0.2)",
																				color: "#7ed4a8",
																			}
																		: {
																				background: "rgba(224,85,85,0.06)",
																				border:
																					"1px solid rgba(224,85,85,0.15)",
																				color: "#e08888",
																			}),
																}}
															>
																{q.feedback}
															</div>
														)}
													</div>
												);
											})}
										</div>

										{!submitted ? (
											<div
												className="justify-end items-end"
												style={{
													display: "flex",
													flexDirection: "column",
													gap: 8,
												}}
											>
												<button
													className="htc-submit btn-cta-gold"
													style={{
														display: "inline-flex",
														alignItems: "center",
														gap: 12,
														fontFamily: "'DM Sans',sans-serif",
														fontSize: 14,
														fontWeight: 600,
														padding: "15px 32px",
														minWidth: 214,
														borderRadius: 3,
														cursor: allAnswered ? "pointer" : "not-allowed",
														letterSpacing: "0.3px",
														opacity: allAnswered ? 1 : 0.4,
														transition: "all 0.2s",
														justifyContent: "center",
													}}
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
												<div
													style={{
														fontSize: 12,
														color: C.muted,
														letterSpacing: 1,
													}}
												>
													Answer all 3 questions to submit
												</div>
											</div>
										) : (
											<div
												style={{
													display: "flex",
													padding: "20px 24px",
													borderRadius: 3,
													marginTop: 8,
													alignItems: "center",
													gap: 16,
													...(passed
														? {
																background: "rgba(76,175,125,0.08)",
																border: "1px solid rgba(76,175,125,0.2)",
															}
														: {
																background: "rgba(224,85,85,0.06)",
																border: "1px solid rgba(224,85,85,0.15)",
															}),
												}}
											>
												<div style={{ fontSize: 24, flexShrink: 0 }}>
													{passed ? "✓" : "✗"}
												</div>
												<div style={{ flex: 1 }}>
													<div
														style={{
															fontSize: 16,
															fontWeight: 600,
															marginBottom: 4,
															color: passed ? "#7ed4a8" : "#e08888",
														}}
													>
														{passed ? "Quiz Passed" : "Not quite"}
													</div>
													<div
														style={{
															fontSize: 13,
															color: C.muted,
															lineHeight: 1.5,
															letterSpacing: "0.5px",
														}}
													>
														{passed
															? currentDay < 4
																? `Day ${currentDay + 2} is now unlocked.`
																: "All 5 days complete."
															: "You need 2/3 to pass. Rewatch the video and try again."}
													</div>
												</div>
												<div style={{ marginLeft: "auto", flexShrink: 0 }}>
													{passed ? (
														<button
															className="htc-unlock btn-cta-gold"
															style={{
																display: "inline-flex",
																alignItems: "center",
																gap: 10,
																fontFamily: "'DM Sans',sans-serif",
																fontSize: 14,
																fontWeight: 600,
																padding: "12px 24px",
																borderRadius: 3,
																cursor: "pointer",
																letterSpacing: "0.3px",
																transition: "all 0.2s",
															}}
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
															className="htc-retry"
															onClick={retakeQuiz}
															style={{
																display: "inline-flex",
																alignItems: "center",
																gap: 8,
																background: "transparent",
																border: "1px solid rgba(224,85,85,0.4)",
																color: "#e08888",
																fontFamily: "'DM Sans',sans-serif",
																fontSize: 13,
																fontWeight: 500,
																padding: "10px 20px",
																borderRadius: 3,
																cursor: "pointer",
																transition: "all 0.2s",
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
						</>
					)}
				</div>
			</main>

			{/* TOAST */}
			<div
				style={{
					position: "fixed",
					bottom: 32,
					right: 32,
					background: C.card,
					border: `1px solid ${C.borderGold}`,
					borderRadius: 4,
					padding: "16px 24px",
					display: "flex",
					alignItems: "center",
					gap: 14,
					transform: toastVisible ? "translateY(0)" : "translateY(100px)",
					opacity: toastVisible ? 1 : 0,
					transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
					zIndex: 999,
					maxWidth: 360,
					pointerEvents: "none",
				}}
			>
				<div style={{ color: C.gold, flexShrink: 0 }}>
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
					style={{ fontSize: 14, color: C.white, lineHeight: 1.4 }}
					dangerouslySetInnerHTML={{ __html: toastMsg }}
				/>
			</div>

			{/* RECOVERY MODAL */}
			{recoveryOpen && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.8)",
						zIndex: 2000,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							background: C.card,
							border: `1px solid ${C.borderGold}`,
							borderRadius: 8,
							padding: 32,
							width: "100%",
							maxWidth: 420,
							position: "relative",
						}}
					>
						<button
							onClick={() => setRecoveryOpen(false)}
							style={{
								position: "absolute",
								top: 16,
								right: 16,
								background: "none",
								border: "none",
								color: C.muted,
								cursor: "pointer",
								fontSize: 20,
								lineHeight: 1,
							}}
						>
							×
						</button>
						<div
							style={{
								fontFamily: "'Playfair Display',serif",
								fontSize: 20,
								color: C.white,
								marginBottom: 8,
							}}
						>
							Lost your link?
						</div>
						<div style={{ fontSize: 13, color: C.text, marginBottom: 24 }}>
							Enter the email you signed up with and we&apos;ll send it right
							back to you.
						</div>
						<iframe
							src="https://api.leadconnectorhq.com/widget/form/zyjRC6a660piFavW9EwB"
							style={{
								width: "100%",
								height: 249,
								border: "none",
								borderRadius: 4,
							}}
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
		<Suspense
			fallback={<div style={{ background: "#070707", minHeight: "100vh" }} />}
		>
			<Portal />
		</Suspense>
	);
}
