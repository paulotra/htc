import { Fragment } from "react";

const items = [
	{ value: "45 minutes", label: "High Ticket Consulting" },
	{ value: "Bruno Bajrami", label: "Host" },
	{ value: "Zoom Call", label: "Format" },
	{ value: "Sent to Email", label: "Confirmation" },
];

export default function SessionDetails() {
	return (
		<div className="md:flex items-center w-full mt-10 md:mt-[120px]">
			{items.map((item, i) => (
				<Fragment key={item.label}>
					{i > 0 && <div className="proof-divider shrink-0" />}
					<div className="flex flex-col gap-3 items-center text-center flex-1 py-5">
						<p className="font-serif text-[2rem] text-cream leading-normal">
							{item.value}
						</p>
						<p className="text-[0.75rem] text-muted uppercase tracking-[0.075rem]">
							{item.label}
						</p>
					</div>
				</Fragment>
			))}
		</div>
	);
}
