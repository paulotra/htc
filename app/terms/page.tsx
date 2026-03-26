
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
	title: "HTC — Terms of Service",
};

const sections = [
	{
		title: "1. About the Platform",
		body: "HTC PAIR is an AI-powered sales training platform that provides roleplay simulations, tonality feedback, call summaries, and performance scoring for sales professionals. The platform is designed to help users improve their high ticket closing skills through AI-driven practice and analysis.",
	},
	{
		title: "2. Eligibility",
		body: "You must be at least 18 years old to use this platform. By creating an account, you represent that you meet this requirement and that all information you provide is accurate and complete.",
	},
	{
		title: "3. Account Registration",
		body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at brunoobsessed@gmail.com if you become aware of any unauthorized use of your account. Bajrami Group Inc. is not liable for any loss resulting from unauthorized use of your account.",
	},
	{
		title: "4. Payments and Subscriptions",
		body: "Access to certain features of HTC PAIR requires a paid subscription. All payments are processed securely through our payment provider. Subscription fees are billed in advance on a recurring basis according to the plan you select. All sales are final unless otherwise stated. If you believe you have been charged in error, contact us at brunoobsessed@gmail.com within 7 days of the charge.",
	},
	{
		title: "5. Refund Policy",
		body: "Due to the digital nature of our product, all purchases are generally non-refundable. Exceptions may be made at the sole discretion of Bajrami Group Inc. in cases of technical failure that prevented access to the platform. To request a refund, contact brunoobsessed@gmail.com within 7 days of purchase with your order details.",
	},
	{
		title: "6. Acceptable Use",
		body: "You agree not to use the platform for any unlawful purpose, to harass or harm others, to attempt to gain unauthorized access to any part of the platform, to reverse engineer or copy any part of the platform's AI systems, or to resell or redistribute access to the platform without written permission from Bajrami Group Inc.",
	},
	{
		title: "7. AI-Generated Content",
		body: "The platform uses artificial intelligence to generate feedback, summaries, and coaching responses. This content is provided for educational and training purposes only. It does not constitute professional financial, legal, or business advice. Results may vary and are not guaranteed.",
	},
	{
		title: "8. Intellectual Property",
		body: "All content, frameworks, methodologies, and technology on this platform are the intellectual property of Bajrami Group Inc. You may not copy, reproduce, distribute, or create derivative works from any part of the platform without our express written consent.",
	},
	{
		title: "9. Disclaimers",
		body: 'The platform is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or that results from using the platform will meet your expectations. Income and results mentioned on the platform are not typical and depend entirely on individual effort and circumstances.',
	},
	{
		title: "10. Limitation of Liability",
		body: "To the maximum extent permitted by law, Bajrami Group Inc. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the platform, even if we have been advised of the possibility of such damages.",
	},
	{
		title: "11. Termination",
		body: "We reserve the right to suspend or terminate your account at any time if you violate these terms. You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period.",
	},
	{
		title: "12. Changes to These Terms",
		body: "We may update these Terms of Service from time to time. We will notify you of material changes by posting the updated terms on this page with a new effective date. Your continued use of the platform after changes constitutes acceptance of the new terms.",
	},
	{
		title: "13. Governing Law",
		body: "These terms are governed by the laws of the State of Delaware, United States. Any disputes shall be resolved in the courts of Delaware.",
	},
	{
		title: "14. Contact",
		body: null,
		contact: true,
	},
];

export default function TermsPage() {
	return (
		<div className="relative">
			<div className="max-w-container mx-auto px-7 min-h-screen flex flex-col">
				<Nav />
				<div
					className="absolute inset-0 opacity-60 z-0"
					style={{
						backgroundImage: "url(/images/middle.webp)",
						backgroundPosition: "center 80px",
						backgroundRepeat: "no-repeat",
						backgroundSize: "cover",
					}}
				></div>
				<main className="flex-1 flex flex-col pt-40 pb-20 max-w-[920px] mx-auto relative">
					<h1 className="font-serif text-[42px] leading-[1.1] font-normal text-white mb-2">
						Terms of Service
					</h1>
					<p className="text-xs font-normal tracking-[3px] uppercase text-white/35 mb-12">
						Effective Date: March 24, 2026
					</p>

					<p className="text-lg font-light leading-8 text-[#9a9a9a] mb-10">
						These Terms of Service govern your access to and use of the HTC PAIR
						platform operated by Bajrami Group Inc. (&quot;Company&quot;,
						&quot;we&quot;, &quot;us&quot;). By accessing or using our platform
						at htcroleplay.highticketjobs.ai, you agree to be bound by these
						terms.
					</p>

					<div className="flex flex-col gap-8">
						{sections.map((s) => (
							<section key={s.title} className="flex flex-col gap-3">
								<h2 className="font-serif text-[20px] leading-normal font-normal text-white">
									{s.title}
								</h2>
								{s.contact ? (
									<p className="text-lg font-light leading-8 text-[#9a9a9a]">
										For any questions about these Terms of Service, contact us
										at{" "}
										<a
											href="mailto:brunoobsessed@gmail.com"
											className="text-[#f0df7a]"
										>
											brunoobsessed@gmail.com
										</a>
										.
									</p>
								) : (
									<p className="text-lg font-light leading-8 text-[#9a9a9a]">
										{s.body}
									</p>
								)}
							</section>
						))}
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
}
