import type { Metadata } from "next";
import BookingPage from "@/components/BookingPage";

export const metadata: Metadata = {
	title: "HTC — Apply for the Mastery Call",
};

export default function Booking() {
	return <BookingPage />;
}
