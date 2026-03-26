import Pill from "./Pill";

export default function ContentSection() {
	return (
		<div className="md:flex text-center md:text-left justify-between gap-8 pt-20 items-center md:mt-10 relative">
			<div
				className="flex flex-col gap-5"
				style={{ flex: "0 0 calc(4/12*100%)" }}
			>
				<div>
					<Pill>Choose Your Path</Pill>
				</div>
				<h2 className="font-serif text-[3.75rem] leading-[4.25rem] font-normal text-white">
					One Skill.
					<span className="block text-[#f0df7a]">No Ceiling.</span>
				</h2>
				<p className="text-lg font-light leading-8 text-[#9a9a9a]">
					High ticket closing is the fastest path to financial freedom without a
					degree, a business, or an audience.
				</p>
			</div>

			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src="/images/bruno-phone.webp"
				className="md:absolute left-0 top-[-80px] right-0 mx-auto max-w-[760px] w-full -my-10 md:my-0"
				alt=""
			/>

			<div
				className="flex flex-col gap-5 text-center md:text-right"
				style={{ flex: "0 0 calc(4/12*100%)" }}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/images/figma/8213e8df-28ed-4522-8e94-cdb49ca061a7.svg"
					className="w-[50px] h-10 mx-auto md:ml-auto"
					alt=""
				/>
				<p className="font-serif text-[2.25rem] italic font-normal text-white leading-normal">
					Most people spend years waiting for a raise. My students spend 8 weeks
					learning to close.
				</p>
				<p className="text-lg font-light text-[#9a9a9a]">- Bruno Bajrami</p>
			</div>
		</div>
	);
}
