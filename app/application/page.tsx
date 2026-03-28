
import type { Metadata } from "next";
import TrainingPage from "@/components/TrainingPage";

export const metadata: Metadata = {
	title: "HTC — Training",
};

export default function Training() {
	return <TrainingPage />;
}
