export interface Lesson {
	title: string;
	desc: string;
}

export interface QuizQ {
	q: string;
	opts: string[];
	correct: number;
	feedback: string;
}

export interface DayData {
	title: string;
	shortTitle: string;
	eyebrow: string;
	desc: string;
	duration: string;
	videoUrl: string;
	lessons: Lesson[];
	quiz: QuizQ[];
}

export type QAnswers = Record<number, Record<number, number>>;
export type QFlags = Record<number, boolean>;

export const KEYS = ["A", "B", "C", "D"];

export const DAYS: DayData[] = [
	{
		title: "Why Closing Is the\nHighest-Leverage Skill",
		shortTitle: "The Closer Advantage",
		eyebrow: "Day 01 — Belief Install",
		desc: "Most people in sales are order-takers. Closers are a different species. Today you'll understand why this skill creates more leverage than almost anything else you can learn in 2025.",
		duration: "18 min",
		videoUrl: "https://player.vimeo.com/video/1087340706?h=690188b40f&autoplay=1",
		lessons: [
			{ title: "The difference between selling and closing", desc: "Why most salespeople are leaving 80% of money on the table every single call." },
			{ title: "How closers create $10k months", desc: "The exact math behind a remote closing income and why the barrier to entry is lower than you think." },
			{ title: "The identity shift that changes everything", desc: "You don't learn to close. You become a closer. Here's what that actually means." },
		],
		quiz: [
			{ q: "What's the core difference between a salesperson and a closer?", opts: ["A closer uses more aggressive tactics", "A closer diagnoses the prospect's problem before presenting a solution", "A closer always follows up more than a salesperson", "A closer focuses only on price"], correct: 1, feedback: "Exactly. Closers diagnose first. Order-takers pitch. That's the entire difference." },
			{ q: "According to Day 1, what percentage of potential income do most salespeople leave on the table?", opts: ["50%", "60%", "80%", "90%"], correct: 2, feedback: "80%. Most salespeople never even get to the real objection — they fold too early." },
			{ q: "The identity shift in closing means:", opts: ["Pretending to be confident even when you're not", "Memorizing more scripts", "Becoming a closer internally before the results show externally", "Closing as many deals as possible to build experience"], correct: 2, feedback: "Identity before results. You don't wait to feel like a closer — you decide to be one first." },
		],
	},
	{
		title: "What Closers\nActually Do",
		shortTitle: "The Real Job",
		eyebrow: "Day 02 — Foundations",
		desc: "Strip away the myths. Today you'll see exactly what a day in the life of a top closer looks like — and why it's nothing like what most people imagine.",
		duration: "22 min",
		videoUrl: "https://player.vimeo.com/video/1087341346?h=720662db76&autoplay=1",
		lessons: [
			{ title: "The remote closer's daily workflow", desc: "Calls, offers, commissions, and how the whole ecosystem fits together." },
			{ title: "How to find legitimate high-ticket offers", desc: "Not all programs are equal. Here's the filter I use to only work with premium offers." },
			{ title: "What top closers earn — with real numbers", desc: "Real commission structures, realistic targets, and what 90 days looks like." },
		],
		quiz: [
			{ q: "What is the primary way remote closers get paid?", opts: ["Hourly rate", "Monthly retainer", "Commission on closed deals", "Equity in the company"], correct: 2, feedback: "Commission only. No close, no pay — which is why the skill itself is so valuable." },
			{ q: "When evaluating a high-ticket offer to close for, what's the most important filter?", opts: ["How high the commission percentage is", "Whether the offer actually delivers results for clients", "How well-known the founder is", "How many closers are already on the team"], correct: 1, feedback: "If the offer doesn't deliver real results, you'll be fighting objections that are justified. Only close for offers you believe in." },
			{ q: "What's a realistic income target for a closer in their first 90 days?", opts: ["$500–$1,000/month", "$1,000–$3,000/month", "$3,000–$10,000/month", "$20,000+/month immediately"], correct: 2, feedback: "$3k–$10k is the realistic range. Not overnight millions — but real, significant income if you do the work." },
		],
	},
	{
		title: "The Mindset That\nSeparates Elite Closers",
		shortTitle: "Elite Mindset",
		eyebrow: "Day 03 — Psychology",
		desc: "Skill gets you on the call. Mindset determines if you close. Today is the hardest day — and the most important.",
		duration: "25 min",
		videoUrl: "https://player.vimeo.com/video/1087342795?h=c2513c9ef8&autoplay=1",
		lessons: [
			{ title: "Why pressure reveals character", desc: "Most people fold the moment a prospect pushes back. You won't — after today." },
			{ title: "Detachment from outcome", desc: "The counterintuitive mindset that makes you close more by caring less." },
			{ title: "Identity before results", desc: "How to show up as a closer before you have the results to prove it." },
		],
		quiz: [
			{ q: "What happens to most closers the moment a prospect pushes back?", opts: ["They get more aggressive", "They lower the price immediately", "They fold and lose the sale", "They ask more questions"], correct: 2, feedback: "They fold. Pressure reveals character. The closers who stay calm and curious are the ones who win." },
			{ q: "What does 'detachment from outcome' mean in closing?", opts: ["Not caring whether you close or not", "Being so focused on process that the result takes care of itself", "Avoiding high-pressure situations", "Letting the prospect make all the decisions"], correct: 1, feedback: "It means trusting the process so completely that your energy isn't desperate. Desperation kills deals. Calm confidence closes them." },
			{ q: "Why is mindset more important than skill on a sales call?", opts: ["Because scripts don't matter", "Because skill can be faked but mindset cannot", "Because prospects can sense your internal state and react to it", "Because mindset determines how many calls you book"], correct: 2, feedback: "Prospects feel your energy before they process your words. A calm, certain closer wins over a skilled but nervous one every time." },
		],
	},
	{
		title: "Your First Live\nClosing Framework",
		shortTitle: "The Framework",
		eyebrow: "Day 04 — The Skill",
		desc: "This is where you go from understanding closing to actually doing it. Today I hand you the exact framework I use on every call.",
		duration: "31 min",
		videoUrl: "https://player.vimeo.com/video/1087343397?h=10d9a6cf78&autoplay=1",
		lessons: [
			{ title: "The diagnostic call structure", desc: "Forget 'Always Be Closing.' Great closers diagnose first. Here's the 5-phase framework." },
			{ title: "Handling 'I need to think about it'", desc: "The exact words I use. Word for word. And why they work every time." },
			{ title: "Pattern interrupt for price objections", desc: "When they say the price is too high, most closers panic. You'll know exactly what to say." },
		],
		quiz: [
			{ q: "In the diagnostic call framework, what comes before presenting the solution?", opts: ["Building rapport with small talk", "Deeply understanding the prospect's problem and pain", "Explaining your credentials", "Sharing testimonials from past clients"], correct: 1, feedback: "You diagnose before you prescribe. A doctor doesn't recommend surgery before examining the patient. Neither does a great closer." },
			{ q: "When a prospect says 'I need to think about it', the best response is:", opts: ["Give them space and follow up in a week", "Immediately offer a discount to speed up the decision", "Ask what specifically they need to think about", "Tell them the price goes up tomorrow"], correct: 2, feedback: "'I need to think about it' is never the real objection. It's a smoke screen. Your job is to find what's underneath it." },
			{ q: "When a prospect says the price is too high, a closer should:", opts: ["Immediately lower the price", "Defend the price by listing features", "Reframe value by reconnecting them to the cost of NOT solving their problem", "Agree and offer a payment plan first"], correct: 2, feedback: "Price is never the real issue — perceived value is. Reconnect them to what staying stuck costs them, and the price becomes irrelevant." },
		],
	},
	{
		title: "What's Holding You\nBack — And What's Next",
		shortTitle: "Your Next Move",
		eyebrow: "Day 05 — The Close",
		desc: "You've done what 99% of people won't. Five days in. Today we diagnose exactly what's standing between you and your first $5k month — and I show you the path forward.",
		duration: "20 min",
		videoUrl: "https://player.vimeo.com/video/1087344571?h=a88e600009&autoplay=1",
		lessons: [
			{ title: "The 3 reasons most closers never make real money", desc: "Brutal honesty about the gaps that separate people who try and people who succeed." },
			{ title: "Building your 90-day closer roadmap", desc: "Exactly what the next 90 days should look like if you're serious about this." },
			{ title: "Your next move with HTC", desc: "Two paths forward — and how to know which one is right for you." },
		],
		quiz: [
			{ q: "What is the #1 reason most closers fail to make real income?", opts: ["They don't know enough objection handling scripts", "They treat closing as a skill to learn rather than an identity to embody", "They can't find good offers to close for", "They don't make enough calls per day"], correct: 1, feedback: "Skill without identity is just information. The closers who win have internalized this as who they are — not just what they do." },
			{ q: "In your 90-day roadmap, what should the first 30 days focus on?", opts: ["Closing as many deals as possible immediately", "Building the foundation — mindset, framework, and landing your first offer", "Building a personal brand on social media", "Studying advanced negotiation tactics"], correct: 1, feedback: "Foundation first. Speed without direction is just chaos. Get the fundamentals locked before scaling volume." },
			{ q: "After completing this training, what separates people who succeed from those who don't?", opts: ["Having a better script", "Taking immediate action on what they've learned", "Waiting until conditions are perfect", "Finding the cheapest program to join"], correct: 1, feedback: "Information without action is worthless. You now know more than 95% of people who call themselves closers. The only question is — what are you going to do with it?" },
		],
	},
];
