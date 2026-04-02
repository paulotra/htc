"use client";

import { useEffect, useRef } from "react";

interface Props {
	onContinue: () => void;
}

export default function WelcomeModal({ onContinue }: Props) {
	const firedRef = useRef(false);
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (firedRef.current) return;
		firedRef.current = true;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		// import("canvas-confetti").then(({ default: confetti }) => {
		// 	const colors = ["#f7e280", "#c9a84c", "#ffffff", "#f0df7a", "#ffe066"];
		// 	confetti({
		// 		particleCount: 120,
		// 		spread: 360,
		// 		startVelocity: 28,
		// 		decay: 0.92,
		// 		scalar: 0.9,
		// 		origin: { x: 0.5, y: 0.5 },
		// 		colors,
		// 		zIndex: 9999,
		// 	});
		// });
	}, []);

	useEffect(() => {
		dialogRef.current?.focus();
	}, []);

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
				aria-labelledby="welcome-title"
				aria-describedby="welcome-desc"
				tabIndex={-1}
				className="relative w-full max-w-[440px] rounded-[4px] overflow-hidden flex flex-col items-center gap-0 pb-10 pt-14 px-8"
				style={{
					background: "#000",
					border: "1px solid rgba(66,58,46,0.6)",
					animation: "fadeUp 0.4s ease forwards",
				}}
			>
				{/* Star icon — decorative */}
				<img
					src="/images/figma/57a5ad31-52f7-44a9-adb0-b632819f627c.svg"
					className="w-[48px] h-[48px] mb-6"
					alt=""
				/>

				{/* Heading */}
				<h2
					id="welcome-title"
					className="font-serif text-[2rem] text-white text-center mb-3 leading-tight"
					style={{ fontFamily: "'Didact Gothic', 'Playfair Display', serif" }}
				>
					You’re In. Day 1 Starts Now.
				</h2>

				{/* Description */}
				<p
					id="welcome-desc"
					className="text-[15px] font-light text-[#9a9a9a] text-center leading-[1.6] mb-8 max-w-[320px]"
				>
					Most people say “I’ll start later.” Later never comes. Let’s see if
					you’re different.
				</p>

				{/* Continue button */}
				<button
					onClick={onContinue}
					aria-label="Begin training"
					className="relative w-full flex items-center justify-center gap-3 py-4 px-10 rounded-[60px] text-white text-[17px] font-light cursor-pointer transition-opacity hover:opacity-90 active:opacity-70 overflow-hidden"
					style={{
						border: "1px solid #dfcaac",
						background:
							"radial-gradient(ellipse at 50% 120%, #c9a572 0%, rgba(240,223,122,0) 70%)",
						boxShadow: "inset 0px -2px 14px 0px #ffc26c",
					}}
				>
					Start Day 1 Now
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
