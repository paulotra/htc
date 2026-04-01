const imgArrow = "/images/figma/8bfb72c0-fdd2-41ca-83ec-d96dc00bd81d.svg";
const imgDecorLeft = "/images/figma/89ffbb2d-ce28-4430-840b-4e2f7d03c0a0.svg";
const imgDecorRight = "/images/figma/077719d8-8194-4fe1-931a-f4253bcc8c54.svg";

import Link from "next/link";
import Pill from "./Pill";

interface FooterProps {
	hideCta?: boolean;
}

export default function Footer({ hideCta = false }: FooterProps) {
	return (
		<footer className="flex flex-col gap-10 items-center">
			<div className="relative w-full border-t border-[#423a2e80] overflow-hidden flex flex-col items-center justify-center gap-[91px] py-[40px] pb-[32px]">
				{/* Decorative side panels */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={imgDecorLeft}
					alt=""
					className="absolute pointer-events-none hidden md:block md:left-[-30%] lg:-left-px top-20 w-[560px] h-[878px] object-fill"
				/>
				<div className="absolute pointer-events-none  hidden md:block md:right-[-30%] lg:-right-px top-20 w-[560px] h-[878px] -scale-x-100">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={imgDecorRight}
						alt=""
						style={{ width: 560, height: 878, objectFit: "fill" }}
					/>
				</div>

				{/* Content */}
				<div className="relative flex flex-col gap-[32px] items-center max-w-container w-full z-[1] px-7">
					{!hideCta ? (
						<div
							data-gsap="stagger-parent"
							className="flex flex-col gap-5 items-center"
						>
							<div data-gsap="stagger-child">
								<Pill>Your Move</Pill>
							</div>
							<h2
								data-gsap="stagger-child"
								className="font-serif text-4xl  md:text-[3.75rem] md:leading-[4.25rem] font-normal text-white text-center capitalize"
							>
								Ready to Write Your
								<br />
								<span className="gold-text">Own Story?</span>
							</h2>
							<p
								data-gsap="stagger-child"
								className="font-light text-lg text-[#9a9a9a] text-center max-w-[520px]"
							>
								Every closer above started exactly where you are. The only
								difference is they decided.
							</p>
						</div>
					) : (
						<div
							data-gsap="stagger-parent"
							className="flex flex-col gap-5 items-center"
						>
							<h2
								data-gsap="stagger-child"
								className="font-serif text-4xl  md:text-[3.75rem] md:leading-[4.25rem] font-normal text-white text-center capitalize"
							>
								See You
								<br />
								<span className="gold-text">On The Call</span>
							</h2>
							<p
								data-gsap="stagger-child"
								className="font-light text-lg text-[#9a9a9a] text-center"
							>
								Every closer above started with one decision. You just made
								yours. See you on the call.
							</p>
							<p
								data-gsap="stagger-child"
								className="font-light text-lg text-[#9a9a9a] text-center"
							>
								- Bruno Bajrami
							</p>
						</div>
					)}

					{!hideCta && (
						<Link
							data-gsap="fade-up"
							href="/booking"
							className="btn-cta-gold flex items-center justify-center gap-2.5 px-11 py-4 md:py-6 rounded-[60px] text-lg font-light text-white no-underline whitespace-nowrap transition-opacity active:opacity-80"
						>
							Apply for the Mastery Call
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={imgArrow} width={24} height={24} alt="" />
						</Link>
					)}

					<div className="flex items-center justify-between max-w-container pt-6 mt-8 border-t border-[#423a2e80] w-full">
						<p className="font-light text-sm text-[#9a9a9a] text-center">
							© 2026 High Ticket Consulting
						</p>
						<div className="flex items-center gap-x-4">
							<Link
								href="/privacy-policy"
								className="font-light text-sm text-[#9a9a9a]"
							>
								Privacy Policy
							</Link>
							<div className="border-r w"></div>
							<Link href="/terms" className="font-light text-sm text-[#9a9a9a]">
								Terms
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
