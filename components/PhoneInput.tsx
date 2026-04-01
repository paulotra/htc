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
		const id = "iti-dark-theme";
		if (!document.getElementById(id)) {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = `
				.iti__dropdown-content, .iti__country-list { background: #0d0d0b !important; border: 1px solid #423a2e !important; }
				.iti__country { background: #0d0d0b !important; color: #ede8de !important; }
				.iti__country.iti__highlight, .iti__country:hover { background: rgba(245,201,87,0.08) !important; }
				.iti__country-name { color: #ede8de !important; }
				.iti__dial-code { color: rgba(237,232,222,0.5) !important; }
				.iti__search-input { background: #060605 !important; border: none !important; border-bottom: 1px solid #423a2e !important; color: #ede8de !important; outline: none !important; box-shadow: none !important; }
				.iti__search-input::placeholder { color: rgba(237,232,222,0.35) !important; }
				.iti__country-list::-webkit-scrollbar { width: 4px; }
				.iti__country-list::-webkit-scrollbar-track { background: #0d0d0b; }
				.iti__country-list::-webkit-scrollbar-thumb { background: #423a2e; border-radius: 2px; }
			`;
			document.head.appendChild(style);
		}
	}, []);

	useEffect(() => {
		const el = elRef.current;
		if (!el) return;

		let mounted = true;
		itiRef.current = intlTelInput(el, {
			initialCountry: "auto",
			geoIpLookup: (cb) => {
				fetch("https://ipapi.co/json")
					.then((r) => r.json())
					.then((d) => {
						if (mounted) cb(d.country_code);
					})
					.catch(() => {
						if (mounted) cb("us");
					});
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
			placeholder="Phone number (optional)"
			aria-label="Phone number"
			className={className}
		/>
	);
}
