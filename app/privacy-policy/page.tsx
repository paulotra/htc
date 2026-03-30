import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
	title: "HTC — Privacy Policy",
};

const sections = [
	{
		title: "1. Information We Collect",
		body: "We collect information you provide directly to us when you create an account, including your name, email address, and payment information. We also collect information generated through your use of the platform, including your roleplay session data, AI feedback interactions, performance scores, and call analysis summaries. We may also collect technical data such as your IP address, browser type, device information, and usage patterns.",
	},
	{
		title: "2. How We Use Your Information",
		body: "We use your information to provide and improve the platform, process your payments, send you account-related communications, generate AI feedback and performance analysis personalized to your sessions, and respond to your support requests. We do not sell your personal data to third parties.",
	},
	{
		title: "3. AI Training Data",
		body: "Your roleplay sessions and interactions with the platform may be used in anonymized and aggregated form to improve our AI models and platform performance. We will never use your personally identifiable information to train AI models that are shared with third parties.",
	},
	{
		title: "4. Payment Information",
		body: "All payment processing is handled by our third-party payment processor. We do not store your full credit card or bank account details on our servers. Payment data is processed and stored securely by our payment provider in accordance with PCI-DSS standards.",
	},
	{
		title: "5. Cookies and Tracking",
		body: "We use cookies and similar technologies to keep you logged in, remember your preferences, and analyze how the platform is used. You can disable cookies through your browser settings, though some features of the platform may not function properly without them.",
	},
	{
		title: "6. Data Sharing",
		body: "We do not sell or rent your personal information. We may share your information with trusted service providers who assist us in operating the platform (such as payment processors, hosting providers, and analytics tools), but only to the extent necessary to provide those services. All third-party providers are contractually obligated to protect your data.",
	},
	{
		title: "7. Data Retention",
		body: "We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it by law.",
	},
	{
		title: "8. Your Rights",
		body: "You have the right to access, correct, or delete your personal information at any time. You may also request a copy of the data we hold about you. To exercise any of these rights, contact us at brunoobsessed@gmail.com. We will respond within 30 days.",
	},
	{
		title: "9. Security",
		body: "We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no internet transmission is completely secure, and we cannot guarantee absolute security.",
	},
	{
		title: "10. Children's Privacy",
		body: "Our platform is not directed at children under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with their information, contact us at brunoobsessed@gmail.com and we will delete it promptly.",
	},
	{
		title: "11. International Users",
		body: "Our platform is operated from the United States. If you are accessing the platform from outside the US, your information may be transferred to and processed in the United States, where data protection laws may differ from those in your country.",
	},
	{
		title: "12. Changes to This Policy",
		body: "We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a new effective date. Your continued use of the platform after changes constitutes acceptance of the updated policy.",
	},
	{
		title: "13. Contact",
		body: null,
	},
];

export default function PrivacyPolicyPage() {
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
					<h1 className="font-serif text-[2.625rem] leading-[1.1] font-normal text-white mb-2">
						Privacy Policy
					</h1>
					<p className="text-xs font-normal tracking-[0.1875rem] uppercase text-white/35 mb-12">
						Effective Date: March 24, 2026
					</p>

					<p className="text-lg font-light leading-8 text-[#9a9a9a] mb-10">
						Bajrami Group Inc. (&quot;Company&quot;, &quot;we&quot;,
						&quot;us&quot;) operates the HTC PAIR platform at
						htcroleplay.highticketjobs.ai. This Privacy Policy explains how we
						collect, use, and protect your personal information when you use our
						platform.
					</p>

					<div className="flex flex-col gap-8">
						{sections.map((s) => (
							<section key={s.title} className="flex flex-col gap-3">
								<h2 className="font-serif text-[1.25rem] leading-normal font-normal text-white">
									{s.title}
								</h2>
								{s.body === null ? (
									<p className="text-lg font-light leading-8 text-[#9a9a9a]">
										If you have any questions about this Privacy Policy or how
										we handle your data, contact us at{" "}
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
