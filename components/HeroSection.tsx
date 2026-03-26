import Link from "next/link";
import Nav from "./Nav";

export default function HeroSection() {
	return (
		<section>
			<Nav />
			<div className="relative min-h-screen flex flex-col items-center justify-center pb-[3.75rem]">
				<div className="max-w-container mx-auto relative overflow-visible flex items-center justify-center">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/images/glow.svg"
						width={1400}
						className="absolute top-[-440px] right-[-340px]"
						alt=""
					/>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/images/name.svg"
						className="max-w-[1200px] mt-[240px] mx-auto opacity-20 w-[88%] lg:w-full"
						alt=""
					/>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/images/bruno.webp"
						className="absolute z-0 top-[60px] md:top-[12px] lg:top-[-40px] w-[120%] max-w-none md:w-full md:max-w-[1080px]"
						alt=""
					/>
				</div>

				<div className="flex flex-col gap-[32px] items-center text-center px-7 relative max-w-[760px] w-full">
					<div className="flex flex-col gap-5 items-center">
						{/* <div className="border border-white/[0.12] rounded-[30px] px-4 py-2 text-xs font-normal tracking-[0.125rem] uppercase text-white">
							High Ticket Consulting
						</div> */}
						<h1 className="font-serif text-[3.75rem] leading-[4rem] font-normal text-white mt-5">
							The Skill That
							<span className="block text-[#f0df7a]">Changes Everything</span>
						</h1>
						<p className="text-lg font-light leading-8 text-[#9a9a9a] max-w-[500px]">
							High ticket closing. The highest-leverage skill available right
							now. Two ways to start.
						</p>
					</div>

					<div className="flex gap-5 flex-wrap justify-center w-full">
						<Link
							href="/booking"
							className="btn-cta-gold flex-1 flex items-center justify-center gap-2.5 px-11 py-6 rounded-[60px] text-lg font-light text-white no-underline whitespace-nowrap transition-opacity active:opacity-80"
						>
							Book your HTC mastery call
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/images/figma/ab357bbf-fa5c-4743-af89-87f90cfb66ba.svg"
								width={24}
								height={24}
								alt=""
							/>
						</Link>
						<Link
							href="/training"
							className="btn-cta-silver flex-1 flex items-center justify-center gap-2.5 px-11 py-6 rounded-[60px] text-lg font-light text-white no-underline whitespace-nowrap transition-opacity active:opacity-80"
						>
							Start free training
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/images/figma/8bfb72c0-fdd2-41ca-83ec-d96dc00bd81d.svg"
								width={24}
								height={24}
								alt=""
							/>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
