export default function PillStar() {
	return (
		<div
			data-gsap="fade-up"
			className="pill-star-wrap md:mt-[-40px]"
			style={{ paddingTop: "52px" }}
		>
			<div
				className="pill-star relative z-[1] inline-flex items-center gap-2.5 border border-[#e5ce78] rounded-[30px] px-7 py-[10px] pb-3 text-xs font-normal tracking-[0.075rem] uppercase text-white whitespace-nowrap"
				style={{
					background:
						"linear-gradient(to right, #000 0%, rgba(214,184,117,0) 100%)",
				}}
			>
				Join 500+ closers who started exactly here
			</div>
		</div>
	);
}
