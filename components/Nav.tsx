interface NavProps {
	badge?: string;
	border?: boolean;
}

import Link from "next/link";

export default function Nav({
	badge = "3 Spots Open",
	border = false,
}: NavProps) {
	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-[100] w-full${border ? " border-b border-[#423a2e]" : ""}`}
		>
			<div
				className={`max-w-container px-5 py-8 md:px-7 mx-auto flex-1 flex flex-col md:flex-row items-center justify-between ${border ? "md:py-4" : "md:py-7"}`}
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
