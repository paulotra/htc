"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "./Nav";
import Pill from "./Pill";
import PhoneInput from "./PhoneInput";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = [
	"9:00 AM",
	"9:30 AM",
	"10:00 AM",
	"10:30 AM",
	"11:00 AM",
	"11:30 AM",
	"2:00 PM",
	"2:30 PM",
	"3:00 PM",
	"3:30 PM",
	"4:00 PM",
	"4:30 PM",
];

interface FormData {
	phone: string;
	email: string;
	fname: string;
	lname: string;
	goal: string;
	exp: string;
	serious: string;
	source: string;
}

const FIELDS: {
	key: keyof FormData;
	label: string;
	type: string;
	placeholder: string;
	options?: string[];
}[] = [
	{
		key: "phone",
		label: "Phone",
		type: "tel",
		placeholder: "+1 (000) 000-0000",
	},
	{
		key: "email",
		label: "Email",
		type: "email",
		placeholder: "your@email.com",
	},
	{
		key: "fname",
		label: "First Name",
		type: "text",
		placeholder: "First name",
	},
	{ key: "lname", label: "Last Name", type: "text", placeholder: "Last name" },
	{
		key: "goal",
		label: "90-Day Income Goal",
		type: "select",
		placeholder: "Select Income",
		options: [
			"$3K–$5K/month",
			"$5K–$10K/month",
			"$10K–$20K/month",
			"$20K+/month",
		],
	},
	{
		key: "exp",
		label: "Closing Experience",
		type: "select",
		placeholder: "Select Experience",
		options: [
			"No experience",
			"Under 6 months",
			"6–12 months",
			"1–2 years",
			"2+ years",
		],
	},
	{
		key: "serious",
		label: "Seriousness (1–10)",
		type: "number",
		placeholder: "1–10",
	},
	{
		key: "source",
		label: "How did you find HTC?",
		type: "select",
		placeholder: "Select",
		options: ["Instagram", "TikTok", "YouTube", "Referral", "Other"],
	},
];

const TEXT = "text-[rgba(237,232,222,0.38)]";
const GOLD = "text-[#f5c957]";

export default function BookingPage() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2 | "confirmed">(1);
	const [form, setForm] = useState<FormData>({
		phone: "",
		email: "",
		fname: "",
		lname: "",
		goal: "",
		exp: "",
		serious: "",
		source: "",
	});

	// Sequential field reveal
	const [visibleCount, setVisibleCount] = useState(0);
	const fieldRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

	useEffect(() => {
		const t = setTimeout(() => setVisibleCount(1), 350);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		if (visibleCount > 0) {
			const t = setTimeout(
				() => fieldRefs.current[visibleCount - 1]?.focus(),
				400,
			);
			return () => clearTimeout(t);
		}
	}, [visibleCount]);

	function handleFieldChange(
		key: keyof FormData,
		value: string,
		index: number,
	) {
		setForm((prev) => ({ ...prev, [key]: value }));
		if (value && index === visibleCount - 1 && visibleCount < FIELDS.length) {
			setVisibleCount((v) => v + 1);
		}
	}

	// Calendar
	const now = new Date();
	const [calYear, setCalYear] = useState(now.getFullYear());
	const [calMonth, setCalMonth] = useState(now.getMonth());
	const [selDay, setSelDay] = useState<number | null>(null);
	const [selTime, setSelTime] = useState<string | null>(null);

	function changeMonth(dir: number) {
		setCalMonth((m) => {
			const next = m + dir;
			if (next > 11) {
				setCalYear((y) => y + 1);
				return 0;
			}
			if (next < 0) {
				setCalYear((y) => y - 1);
				return 11;
			}
			return next;
		});
		setSelDay(null);
		setSelTime(null);
	}

	function pickDay(d: number, disabled: boolean) {
		if (disabled) return;
		setSelDay(d);
		setSelTime(null);
		setTimeout(
			() =>
				document
					.getElementById("timeSection")
					?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
			100,
		);
	}

	function pickTime(t: string) {
		setSelTime(t);
		setTimeout(
			() =>
				document
					.getElementById("confirmBtn")
					?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
			100,
		);
	}

	function confirmBooking() {
		router.push("/confirmation");
	}

	// Build calendar cells
	const today = new Date();
	const firstDow = new Date(calYear, calMonth, 1).getDay();
	const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
	const calCells: { d: number | null; disabled: boolean; selected: boolean }[] =
		[];
	for (let i = 0; i < firstDow; i++)
		calCells.push({ d: null, disabled: true, selected: false });
	for (let d = 1; d <= totalDays; d++) {
		const date = new Date(calYear, calMonth, d);
		const isPast =
			date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;
		calCells.push({
			d,
			disabled: isPast || isWeekend,
			selected: selDay === d && !isPast && !isWeekend,
		});
	}

	const step1Done = step === 2 || step === "confirmed";
	const step2Done = step === "confirmed";

	return (
		<div className="relative">
			<Nav badge="3 Spots Open" border />

			<div
				className="absolute inset-0 opacity-60 z-0"
				style={{
					backgroundImage: "url(/images/middle.webp)",
					backgroundPosition: "center center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
				}}
			></div>
			<div className="max-w-container mx-auto px-7 lg:flex gap-16 items-start pt-32 pb-10 min-h-screen relative z-10">
				{/* ── Left panel ── */}
				<div className="relative md:pt-0 pt-10">
					<div className="flex-[0_0_380px] sticky top-36 flex flex-col gap-8">
						<div className="flex flex-col gap-3">
							<h1 className="font-serif text-[2rem] leading-[2.5rem] font-normal">
								<span className="text-white">Book Your</span>
								<span className="block bg-gradient-to-b from-[#f0df7a] from-[0.8%] to-[#c9a572] to-[97.7%] bg-clip-text text-transparent">
									HTC Mastery Call
								</span>
							</h1>
							<div className="flex gap-3 flex-wrap">
								{["45 min", "Direct with Bruno", "No pitch"].map((label) => (
									<div
										key={label}
										className="border border-[#423a2e] rounded-[4px] px-2 py-1 text-[#9a9a9a] text-[0.75rem] tracking-[0.075rem] uppercase whitespace-nowrap"
									>
										{label}
									</div>
								))}
							</div>
						</div>

						{step === 2 && (
							<div className="flex flex-col gap-4 border-t border-[#423a2e] pt-8">
								<div>
									<Pill>Almost There</Pill>
								</div>
								<h1 className="font-serif text-[2rem] leading-[2.5rem] font-normal">
									Pick Your Slot,
									<span className="block text-[#f0df7a]">
										{form.fname || "there"}
									</span>
								</h1>
								<p className={`text-sm font-light leading-relaxed ${TEXT}`}>
									Choose a day and time. Bruno will be there.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* ── Right card ── */}
				<div
					className={`flex-1 cta-card !p-0 bg-black min-h-[calc(100vh_-_168px)] mt-10 lg:mt-0`}
				>
					{/* Step indicator */}
					<div className="relative grid grid-cols-1 md:grid-cols-2">
						{/* Step 1 */}
						<div
							onClick={() => setStep(1)}
							className={`relative cursor-pointer flex flex-col items-center pt-5 pb-4 border-b-[2px] ${step1Done ? "border-[#F7E280]" : "border-[#FFFFFF]"}`}
						>
							<span
								className={`text-[0.75rem] tracking-[0.075rem] uppercase text-[#9a9a9a]`}
							>
								Step 1
							</span>
							<span
								className={`font-serif text-[1.5rem] ${step1Done ? GOLD : "text-white"}`}
							>
								Your Info
							</span>
						</div>
						{/* Step 2 */}
						<div className="flex flex-col items-center pt-5 pb-4 border-b-[2px] border-[#423a2e]">
							<span className="text-[0.75rem] tracking-[0.075rem] uppercase text-[#9a9a9a]">
								Step 2
							</span>
							<span
								className={`font-serif text-[1.5rem] ${step2Done ? GOLD : step1Done ? "text-white" : "text-[#9a9a9a]"}`}
							>
								Pick a Time
							</span>
						</div>
						{/* Check circles */}
						<div className="bg-black px-2 absolute bottom-[50%] md:bottom-0 left-1/2 md:left-1/4 -translate-x-1/2 translate-y-1/2 z-10">
							<CheckCircle done={step1Done} />
						</div>
						<div className="bg-black px-2 absolute bottom-0 left-1/2 md:left-3/4 -translate-x-1/2 translate-y-1/2 z-10">
							<CheckCircle done={step2Done} />
						</div>
					</div>

					{/* ── Step 1: form ── */}
					{step === 1 && (
						<div className="p-8 pt-0 flex flex-col gap-6">
							<div className="grid gril-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
								{FIELDS.map((f, i) => {
									const visible = i < visibleCount;
									return (
										<div
											key={f.key}
											style={{
												maxHeight: visible ? "120px" : "0",
												opacity: visible ? 1 : 0,
												transform: visible
													? "translateY(0)"
													: "translateY(8px)",
												overflow: "hidden",
												transition:
													"max-height 0.4s ease, opacity 0.35s ease, transform 0.35s ease",
												pointerEvents: visible ? "all" : "none",
											}}
										>
											<div className="flex flex-col gap-1 py-4">
												<label
													className={`text-[0.5625rem] font-medium tracking-[0.1875rem] uppercase ${TEXT}`}
												>
													{f.label}
												</label>
												{f.type === "select" ? (
													<div className="relative">
														<select
															value={form[f.key]}
															ref={(el) => {
																fieldRefs.current[i] = el;
															}}
															onChange={(e) =>
																handleFieldChange(f.key, e.target.value, i)
															}
															className={`w-full bg-transparent text-[0.9375rem] font-light outline-none appearance-none border-b border-[#423a2e] py-3 pr-6 focus:border-[#f5c957] transition-colors ${form[f.key] ? "text-white" : "text-[#9a9a9a]"}`}
														>
															<option value="" disabled>
																{f.placeholder}
															</option>
															{f.options!.map((o) => (
																<option
																	key={o}
																	value={o}
																	style={{ background: "#1a1a18" }}
																>
																	{o}
																</option>
															))}
														</select>
														<svg
															className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#9a9a9a]"
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
														>
															<path d="M6 9l6 6 6-6" />
														</svg>
													</div>
												) : f.key === "phone" ? (
													<PhoneInput
														value={form.phone}
														onChange={(num) => handleFieldChange("phone", num, i)}
														inputRef={(el) => { fieldRefs.current[i] = el; }}
														className="w-full bg-transparent text-[0.9375rem] font-light outline-none placeholder:text-[#9a9a9a] text-white border-b border-[#423a2e] py-3 focus:border-[#f5c957] transition-colors"
													/>
												) : (
													<input
														type={f.type}
														value={form[f.key]}
														placeholder={f.placeholder}
														min={f.type === "number" ? 1 : undefined}
														max={f.type === "number" ? 10 : undefined}
														ref={(el) => {
															fieldRefs.current[i] = el;
														}}
														onChange={(e) =>
															handleFieldChange(f.key, e.target.value, i)
														}
														className="w-full bg-transparent text-[0.9375rem] font-light outline-none placeholder:text-[#9a9a9a] text-white border-b border-[#423a2e] py-3 focus:border-[#f5c957] transition-colors"
													/>
												)}
											</div>
										</div>
									);
								})}
							</div>

							<div
								className="flex-col flex"
								style={{
									opacity: visibleCount >= FIELDS.length ? 1 : 0,
									overflow: "hidden",
									transition: "max-height 0.4s ease, opacity 0.35s ease",
									pointerEvents: visibleCount >= FIELDS.length ? "all" : "none",
								}}
							>
								<p className="text-[#9a9a9a] text-sm mb-4 text-center">
									No pressure. No pitch. Just clarity.
								</p>
								<button
									onClick={() => setStep(2)}
									className="btn-cta-gold flex items-center w-full justify-center gap-2.5 px-11 py-4 rounded-[4px] text-base font-light text-white no-underline whitespace-nowrap transition-opacity active:opacity-80"
								>
									Unlock my call slot
									<svg
										width="12"
										height="12"
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

					{/* ── Step 2: calendar ── */}
					{step === 2 && (
						<div className="p-8 pt-0 flex flex-col gap-6">
							{/* Calendar */}
							<div className="cal-box">
								<div className="cal-header">
									<div className="cal-month">
										{MONTHS[calMonth]} {calYear}
									</div>
									<div className="cal-nav-wrap">
										<button className="cal-nav" onClick={() => changeMonth(-1)}>
											←
										</button>
										<button className="cal-nav" onClick={() => changeMonth(1)}>
											→
										</button>
									</div>
								</div>
								<div className="cal-grid">
									{DAYS.map((d) => (
										<div key={d} className="cal-day-label">
											{d}
										</div>
									))}
									{calCells.map((cell, i) => (
										<div
											key={i}
											className={`cal-day ${!cell.d ? "empty" : cell.disabled ? "past" : cell.selected ? "selected" : "available"}`}
											onClick={() => cell.d && pickDay(cell.d, cell.disabled)}
										>
											{cell.d ?? ""}
										</div>
									))}
								</div>
							</div>

							{/* Time slots */}
							<div
								id="timeSection"
								className={`time-section ${selDay ? "show" : ""}`}
							>
								<div className="time-header">
									{selDay
										? `${MONTHS[calMonth]} ${selDay}, ${calYear}`
										: "Select a Time"}
								</div>
								<div className="time-slots">
									{TIMES.map((t) => (
										<div
											key={t}
											className={`time-slot ${selTime === t ? "selected" : ""}`}
											onClick={() => pickTime(t)}
										>
											{t}
										</div>
									))}
								</div>
							</div>

							{/* Confirm button */}
							<button
								id="confirmBtn"
								className={`btn-cta-gold flex items-center w-full justify-center gap-2.5 px-11 py-4 rounded-[4px] text-base font-light text-white no-underline whitespace-nowrap transition-opacity active:opacity-80 ${selTime ? "show" : ""}`}
								onClick={confirmBooking}
							>
								Confirm My Mastery Call
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</button>
						</div>
					)}

					{/* ── Confirmed (commented out — users redirect to /confirm) ── */}
					{/* {step === "confirmed" && (
						<div
							className="p-8 pt-0 flex flex-col items-center gap-5 text-center"
							style={{ animation: "fadeUp 0.4s ease both" }}
						>
							<div className="conf-icon">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#f5c957"
									strokeWidth="2"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
							<span
								className={`text-[0.5625rem] font-normal tracking-[0.25rem] uppercase ${GOLD} opacity-70`}
							>
								Booked
							</span>
							<div className="conf-title">
								You&apos;re On The
								<br />
								<em>Calendar</em>
							</div>
							<p className="conf-detail">
								{selDay && selTime ? (
									<>
										{MONTHS[calMonth]} {selDay}, {calYear} at {selTime}
										<br />
									</>
								) : null}
								Check your email for confirmation.
								<br />
								Bruno will see you soon.
							</p>
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
}

function CheckCircle({
	done,
	className,
}: {
	done: boolean;
	className?: string;
}) {
	return (
		<div
			className={`${className} w-6 h-6 rounded-full flex items-center justify-center ${done ? "bg-[#F7E280]" : "bg-[#423A2E]"}`}
		>
			<svg
				width="10"
				height="8"
				viewBox="0 0 24 18"
				fill="none"
				stroke="#000000"
				strokeWidth="3"
			>
				<polyline points="22 2 9 15 2 8" />
			</svg>
		</div>
	);
}
