"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import PhoneInput from "./PhoneInput";

const TEXT = "text-[#9a9a9a]";
const GOLD = "text-white";

export default function ApplicationPage() {
	const [slide, setSlide] = useState(0);
	const [animating, setAnimating] = useState(false);
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const emailRef = useRef<HTMLInputElement>(null);

	const TOTAL = 2;
	const progress = slide === 0 ? 0 : Math.min((slide / TOTAL) * 100, 100);

	useEffect(() => {
		if (slide === 1) setTimeout(() => emailRef.current?.focus(), 100);
	}, [slide]);

	function goNext() {
		if (animating) return;
		setError("");
		setAnimating(true);
		setTimeout(() => {
			setSlide((s) => s + 1);
			setAnimating(false);
		}, 320);
	}

	function submitEmail() {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim() || !pattern.test(email)) {
			setError("Please enter a valid email address.");
			return;
		}
		goNext();
	}

	async function startTraining() {
		setSubmitting(true);
		try {
			const response = await fetch("/.netlify/functions/optin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, phone }),
			});
			const data = await response.json();
			window.location.href = data.redirect;
		} catch {
			window.location.href =
				"/training?token=" +
				encodeURIComponent(email) +
				"&email=" +
				encodeURIComponent(email);
		}
	}

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Enter") {
				if (slide === 0) {
					goNext();
					return;
				}
				if (slide === 1) {
					submitEmail();
					return;
				}
			}
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

			<div className="max-w-container mx-auto px-7 lg:flex gap-16 items-start pt-32 pb-10 min-h-screen relative z-10">
				{/* Left */}
				<div className="relative md:pt-0 pt-10">
					<div className="flex-[0_0_380px] sticky top-36 flex flex-col gap-8">
						<div className="flex flex-col gap-3">
							<h1 className="font-serif text-[2rem] leading-[2.5rem] font-normal">
								<span className="text-[#9a9a9a]">HTC</span>
								<span className="block text-white">Training</span>
							</h1>
							<div className="flex gap-3 flex-wrap">
								{["5 Days", "Video + Live", "Free"].map((label) => (
									<div
										key={label}
										className="border border-[#423a2e] rounded-[4px] px-2 py-1 text-[#9a9a9a] text-[0.75rem] tracking-[0.075rem] uppercase whitespace-nowrap"
									>
										{label}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Right card */}
				<div className="flex-1 cta-card cta-card-silver !p-0 !bg-black min-h-[calc(100vh_-_168px)] flex flex-col mt-10 lg:mt-0">
					{/* Progress bar */}
					{slide > 0 && slide < 3 && (
						<div className="h-[2px] bg-[#1a1a18] rounded-t-sm overflow-hidden">
							<div
								className="h-full bg-[#fff] transition-all duration-500"
								style={{ width: `${progress}%` }}
							/>
						</div>
					)}

					<div className="flex-1 flex flex-col justify-center items-center p-10 text-center">
						{/* ── Slide 0: Welcome (kept as-is from TrainingPage) ── */}
						{slide === 0 && (
							<div className={slideClass}>
								<div className="md:flex items-center gap-6">
									<img
										src="/images/laptop.webp"
										className="w-full max-w-[440px] mb-6 md:mb-0"
										alt=""
									/>
									<div className="flex flex-col gap-6">
										<h2 className="font-serif text-3xl md:text-5xl leading-normal font-normal text-white">
											The Free <span className={GOLD}>5-Day</span>
											<br />
											Closer Training
										</h2>
										<p
											className={`text-base font-light leading-[1.7] max-w-[480px] ${TEXT}`}
										>
											Most people spend years stuck in low-ticket jobs, watching
											others close $10k months. This training changes that. 5
											days. Real frameworks. Zero fluff.
										</p>
										<div>
											<button
												onClick={goNext}
												className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white transition-opacity active:opacity-80"
											>
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
											<p
												className={`text-[0.75rem] mt-3 tracking-[0.0625rem] ${TEXT}`}
											>
												TAKES 30 SECONDS
											</p>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* ── Slide 1: Email ── */}
						{slide === 1 && (
							<div
								className={slideClass}
								style={{ maxWidth: "640px", width: "100%" }}
							>
								<div className="flex items-center gap-3 text-[0.6875rem] tracking-[0.1875rem] uppercase text-white">
									01
									<span className="block w-6 h-px bg-white opacity-50" />
								</div>
								<p className="font-serif text-3xl md:text-5xl leading-normal font-normal text-white">
									What&apos;s your email?
								</p>
								<p
									className={`text-base font-light leading-[1.6] -mt-4 ${TEXT}`}
								>
									We&apos;ll send your training link here.
								</p>
								<input
									ref={emailRef}
									type="email"
									placeholder="your@email.com"
									autoComplete="email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										setError("");
									}}
									onKeyDown={(e) => e.key === "Enter" && submitEmail()}
									className="bg-transparent border-b border-[#2a2a2a] focus:border-[#fff] text-white text-[1.375rem] font-light py-3 outline-none w-full transition-colors caret-[#fff] placeholder:text-[#333]"
								/>
								{error && (
									<p className="text-[#e05555] text-[0.8125rem] tracking-[0.0625rem]">
										{error}
									</p>
								)}
								<div>
									<button
										onClick={submitEmail}
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
									<p
										className={`text-[0.75rem] mt-3 tracking-[0.0625rem] ${TEXT}`}
									>
										Press Enter ↵
									</p>
								</div>
							</div>
						)}

						{/* ── Slide 2: Phone (optional) ── */}
						{slide === 2 && (
							<div
								className={slideClass}
								style={{ maxWidth: "640px", width: "100%" }}
							>
								<div className="flex items-center gap-3 text-[0.6875rem] tracking-[0.1875rem] uppercase text-white">
									02
									<span className="block w-6 h-px bg-white opacity-50" />
								</div>
								<p className="font-serif text-3xl md:text-5xl leading-normal font-normal text-white">
									Want the scripts + reminders sent to your phone?
								</p>
								<p
									className={`text-base font-light leading-[1.6] -mt-4 ${TEXT}`}
								>
									No spam. Just your daily training + key scripts.
								</p>
								<PhoneInput
									value={phone}
									onChange={setPhone}
									className="bg-transparent border-b border-[#2a2a2a] focus:border-[#fff] text-white text-[1.375rem] font-light py-3 outline-none w-full transition-colors caret-[#fff] placeholder:text-[#333]"
								/>
								<div className="flex flex-col gap-3 items-center">
									<button
										onClick={goNext}
										disabled={submitting}
										className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white transition-opacity active:opacity-80 disabled:opacity-60"
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
									<button
										onClick={goNext}
										className={`text-[0.8125rem] font-light ${TEXT} hover:text-white transition-colors`}
									>
										Skip — just send to email
									</button>
								</div>
							</div>
						)}

						{/* ── Slide 3: Complete (kept as-is from TrainingPage) ── */}
						{slide === 3 && (
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
								<h2 className="font-serif text-3xl md:text-5xl leading-normal font-normal text-white">
									You’re In. Day 1 Starts Now.
								</h2>
								<p className={`text-[1rem] font-light leading-[1.7] ${TEXT}`}>
									Most people say “I’ll start later.” Later never comes. Let’s
									see if you’re different.
								</p>
								<div>
									<button
										onClick={startTraining}
										disabled={submitting}
										className="btn-cta-silver w-full max-w-[280px] justify-center inline-flex items-center gap-3 px-10 py-5 rounded-full text-[1rem] font-medium text-white transition-opacity active:opacity-80 disabled:opacity-60"
									>
										{submitting ? "Sending..." : "Start Day 1 Now"}
										{!submitting && (
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
										)}
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Slide counter */}
					{slide > 0 && slide < 3 && (
						<div
							className={`px-10 pb-6 text-[0.75rem] tracking-[0.125rem] ${TEXT}`}
						>
							<span className={GOLD}>{slide}</span> / {TOTAL}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
