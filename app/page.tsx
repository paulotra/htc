
import HeroSection from "@/components/HeroSection";
import ProofBar from "@/components/ProofBar";
import ContentSection from "@/components/ContentSection";
import PillStar from "@/components/PillStar";
import CtaCards from "@/components/CtaCards";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Footer from "@/components/Footer";

export default function Home() {
	return (
		<main
			style={{
				backgroundImage: "url(/images/hero-bg.webp)",
				backgroundPosition: "center top",
				backgroundRepeat: "no-repeat",
				backgroundSize: "1800px",
			}}
		>
			<HeroSection />
			<ProofBar />
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
				<div className="max-w-container mx-auto px-7 relative z-10">
					<ContentSection />
					<PillStar />
					<CtaCards />
					<TestimonialsCarousel />
				</div>
			</div>
			<Footer />
		</main>
	);
}
