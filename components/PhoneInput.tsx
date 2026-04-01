"use client";

import { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import "intl-tel-input/build/css/intlTelInput.css";

interface PhoneInputProps {
	value: string;
	onChange: (fullNumber: string) => void;
	className?: string;
	inputRef?: React.Ref<HTMLInputElement>;
}

export default function PhoneInput({
	value,
	onChange,
	className,
	inputRef,
}: PhoneInputProps) {
	const elRef = useRef<HTMLInputElement>(null);
	const itiRef = useRef<ReturnType<typeof intlTelInput> | null>(null);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	useEffect(() => {
		const el = elRef.current;
		if (!el) return;

		let mounted = true;
		itiRef.current = intlTelInput(el, {
			initialCountry: "auto",
			geoIpLookup: (cb) => {
				fetch("https://ipapi.co/json")
					.then((r) => r.json())
					.then((d) => { if (mounted) cb(d.country_code); })
					.catch(() => { if (mounted) cb("us"); });
			},
		});

		const handleChange = () => {
			if (!el.value) {
				onChangeRef.current("");
				return;
			}
			try {
				const num = itiRef.current?.getNumber();
				onChangeRef.current(num || el.value);
			} catch {
				onChangeRef.current(el.value);
			}
		};

		el.addEventListener("input", handleChange);
		el.addEventListener("countrychange", handleChange);

		return () => {
			mounted = false;
			el.removeEventListener("input", handleChange);
			el.removeEventListener("countrychange", handleChange);
			itiRef.current?.destroy();
		};
	}, []);

	return (
		<input
			ref={(node) => {
				(elRef as React.MutableRefObject<HTMLInputElement | null>).current =
					node;
				if (typeof inputRef === "function") inputRef(node);
				else if (inputRef)
					(
						inputRef as React.MutableRefObject<HTMLInputElement | null>
					).current = node;
			}}
			type="tel"
			defaultValue={value}
			placeholder="Phone number"
			aria-label="Phone number"
			className={className}
		/>
	);
}
