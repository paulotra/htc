"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeAnimations() {
	useEffect(() => {
		const ctx = gsap.context(() => {
			// ── Hero (load, no scroll trigger) ──
			const tl = gsap.timeline({ delay: 0.15 });
			tl.from("[data-gsap='hero-title']", {
				y: 32,
				opacity: 0,
				duration: 0.9,
				ease: "power3.out",
			})
				.from(
					"[data-gsap='hero-sub']",
					{ y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
					"-=0.55",
				)
				.from(
					"[data-gsap='hero-ctas']",
					{ y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
					"-=0.45",
				);

			// ── Fade-up on scroll ──
			gsap.utils.toArray<Element>("[data-gsap='fade-up']").forEach((el) => {
				gsap.from(el, {
					scrollTrigger: { trigger: el, start: "top 88%", once: true },
					y: 24,
					opacity: 0,
					duration: 0.55,
					ease: "power3.out",
				});
			});

			// ── Stagger groups ──
			gsap.utils
				.toArray<Element>("[data-gsap='stagger-parent']")
				.forEach((parent) => {
					const children = parent.querySelectorAll(
						"[data-gsap='stagger-child']",
					);
					gsap.from(children, {
						scrollTrigger: { trigger: parent, start: "top 88%", once: true },
						y: 24,
						opacity: 0,
						duration: 0.5,
						ease: "power3.out",
						stagger: 0.1,
					});
				});
		});

		requestAnimationFrame(() => ScrollTrigger.refresh());

		return () => ctx.revert();
	}, []);

	return null;
}
