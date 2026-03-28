import type { Metadata } from "next";
import TrainingPortal from "@/components/TrainingPortal";

export const metadata: Metadata = { title: "HTC — Closer Training" };

export default function Training() {
	return <TrainingPortal />;
}
