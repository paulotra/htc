
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BrunoMessage from "@/components/BrunoMessage";
import SessionDetails from "@/components/SessionDetails";
import CallGuidelines from "@/components/CallGuidelines";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
	title: "HTC — Booking Confirmed",
};

export default function ConfirmationPage() {
	return (
		<div>
			<div className="relative z-10 max-w-container mx-auto px-7 flex flex-col">
				<Nav badge="Call Confirmed" />
				<main
					style={{
						backgroundImage: "url(/images/boxes.webp)",
						backgroundPosition: "center top",
						backgroundRepeat: "no-repeat",
						backgroundSize: "1200px",
					}}
				>
					<img
						src="/images/glow.svg"
						width={1400}
						className="absolute top-[-440px] right-[-340px]"
						alt=""
					/>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<div className="flex-1 flex flex-col items-center justify-center text-center gap-8 pt-20 pb-20">
						<img
							src="/images/figma/57a5ad31-52f7-44a9-adb0-b632819f627c.svg"
							className="mt-12"
							width={120}
							height={120}
							alt=""
						/>

						<div className="flex flex-col gap-5 items-center">
							<h1 className="font-serif text-[3.75rem] leading-[4.25rem] font-normal text-white">
								Your Call Is
								<span className="block text-[#f0df7a]">Confirmed</span>
							</h1>
							<p
								className="text-lg font-light text-[#9a9a9a] max-w-[410px]"
								style={{ lineHeight: "26px" }}
							>
								You&apos;re in. Check your inbox for the call link and any prep
								details. We&apos;ll see you soon.
							</p>
						</div>
					</div>
				</main>
			</div>
			<div className="relative pb-[160px]">
				<div
					className="absolute inset-0 opacity-70 z-0"
					style={{
						backgroundImage: "url(/images/middle.webp)",
						backgroundPosition: "center top",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
					}}
				></div>
				<div className="relative max-w-container px-7 mx-auto">
					<SessionDetails />
					<BrunoMessage />
					<CallGuidelines />
					<TestimonialsCarousel />
					<FAQ />
				</div>
			</div>
			<Footer hideCta />
		</div>
	);
}
