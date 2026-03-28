"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface NavProps {
	badge?: string;
	border?: boolean;
}

export default function Nav({
	badge = "3 Spots Open",
	border = false,
}: NavProps) {
	const innerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;

		const nav = el.closest("nav") as HTMLElement;

		const onScroll = () => {
			if (window.scrollY > 40) {
				gsap.to(el, {
					paddingTop: 12,
					paddingBottom: 12,
					duration: 0.3,
					ease: "power2.out",
				});
				gsap.to(nav, {
					backgroundColor: "rgba(255,255,255,0.064)",
					backdropFilter: "blur(16px) saturate(1.4)",
					duration: 0.3,
					ease: "power2.out",
				});
			} else {
				gsap.to(el, {
					paddingTop: border ? 16 : 32,
					paddingBottom: border ? 16 : 32,
					duration: 0.3,
					ease: "power2.out",
				});
				gsap.to(nav, {
					backgroundColor: "rgba(255,10,9,0)",
					backdropFilter: "blur(0px) saturate(1)",
					duration: 0.3,
					ease: "power2.out",
				});
			}
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [border]);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-[100] w-full${border ? " border-b border-[#423a2e]" : ""}`}
		>
			<div
				ref={innerRef}
				className="max-w-container px-5 md:px-7 mx-auto flex-1 flex flex-col md:flex-row items-center justify-between"
				style={{
					paddingTop: border ? 16 : 32,
					paddingBottom: border ? 16 : 32,
				}}
			>
				<Link
					href="/"
					className="font-light text-base tracking-[0.4rem] text-white"
				>
					<img src="/images/logo.svg" width="200" />
				</Link>
				<div className="flex items-center gap-4 py-3.5 rounded-[40px]">
					<div className="relative w-[12px] h-[12px] shrink-0">
						<div className="w-[12px] h-[12px] rounded-full bg-gold relative z-[1]" />
					</div>
					<span className="text-base font-light text-white whitespace-nowrap">
						{badge}
					</span>
				</div>
			</div>
		</nav>
	);
}
