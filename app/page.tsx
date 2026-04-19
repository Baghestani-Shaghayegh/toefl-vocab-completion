import type { Metadata } from "next";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Results", href: "#results" },
  { label: "Pricing", href: "#pricing" },
] as const;

// Keeping marketing content in typed arrays makes future copy and ordering updates
// straightforward without turning the page body into a wall of repeated JSX.
const stats = [
  { value: "15 min", label: "to finish a focused daily lesson" },
  { value: "92%", label: "average weekly completion for active learners" },
  { value: "18k+", label: "paragraph drills generated and completed" },
] as const;

const features = [
  {
    eyebrow: "Practice in context",
    title: "Restore missing letters inside real reading flow",
    description:
      "Learners complete partially hidden words while reading a paragraph, which builds vocabulary recall and reading confidence at the same time.",
  },
  {
    eyebrow: "Instant feedback",
    title: "See what was wrong before the moment is gone",
    description:
      "Every answer is reviewed immediately with quick guidance, so students understand the pattern behind each correction.",
  },
  {
    eyebrow: "Progress tracking",
    title: "Spot weak vocabulary areas across sessions",
    description:
      "Track pace, accuracy, and recurring word families to make practice feel like preparation instead of guessing.",
  },
  {
    eyebrow: "AI-generated sets",
    title: "Refresh drills without repeating the same passage",
    description:
      "Generate new TOEFL-style and IELTS-style exercises with adjustable difficulty and topic variety.",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Start a short reading set",
    description:
      "Choose a passage built around academic vocabulary, timed pacing, and realistic test-style wording.",
  },
  {
    number: "02",
    title: "Fill the missing letters",
    description:
      "Complete hidden word fragments directly in the paragraph so grammar, spelling, and context work together.",
  },
  {
    number: "03",
    title: "Review patterns and repeat",
    description:
      "Use instant feedback and progress summaries to target the word groups most likely to slow you down on exam day.",
  },
] as const;

const testimonials = [
  {
    quote:
      "This feels closer to the pressure of a real reading section than apps that only drill isolated words.",
    name: "Mina K.",
    role: "TOEFL student",
  },
  {
    quote:
      "The missing-letter format keeps students active. They read, predict, and self-correct in one flow.",
    name: "Daniel R.",
    role: "IELTS instructor",
  },
  {
    quote:
      "My study sessions got shorter and more useful because I could see which vocabulary patterns kept tripping me up.",
    name: "Aisha L.",
    role: "Graduate school applicant",
  },
] as const;

const logos = [
  "Northbridge Prep",
  "Global English Lab",
  "Summit Academy",
  "Bridgeway Tutors",
  "FuturePath",
] as const;

const pricingItems = [
  "Unlimited paragraph practice",
  "Adaptive AI-generated exercises",
  "Instant answer explanations",
  "Accuracy and pace tracking",
  "Weekly study summaries",
] as const;

export const metadata: Metadata = {
  title: "LexiLift | TOEFL Vocabulary Practice in Context",
  description:
    "A polished TOEFL-style English learning app where students complete missing letters inside paragraphs, get instant feedback, and track progress over time.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#0f172a]">
      <div className="relative overflow-hidden">
        {/* High-contrast neutrals carry readability; the gradient only adds atmosphere behind the hero. */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[44rem] bg-[linear-gradient(180deg,#0f172a_0%,#173154_28%,#f8f9fa_76%)]" />
        <div className="absolute -left-20 top-24 -z-10 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute right-0 top-16 -z-10 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

        {/* Header: sticky with semi-transparent dark background; simplified with logo + action buttons only */}
        <header className="sticky top-0 z-50 h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-lg font-semibold text-white ring-1 ring-white/20 backdrop-blur">
                L
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight text-white">
                  LexiLift
                </p>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-200">
                  Reading prep
                </p>
              </div>
            </Link>

            {/* Action buttons: Log in + Start free */}
            <div className="flex items-center gap-3">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-100 transition hover:text-white">
                Log in
              </button>
              <Link
                href="/practice"
                className="inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
              >
                Start free
              </Link>
            </div>
          </div>
        </header>

        {/* Hero section: min-h-screen ensures full viewport coverage; scroll-mt-20 accounts for sticky header */}
        <section className="relative h-[calc(100dvh-80px)] scroll-mt-[80px] px-6 py-8  flex items-center sm:px-10 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl self-center">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-sm font-medium text-slate-50 backdrop-blur">
                Designed for TOEFL and IELTS learners who need faster reading accuracy
              </span>
              <h1 className="mt-8 text-5xl font-bold tracking-tight leading-[1.02] text-black sm:text-6xl lg:text-7xl">
                Turn vocabulary practice into a realistic reading workout.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-800 sm:text-xl">
                Students complete missing letters inside academic paragraphs,
                receive instant feedback, and build the exam-day habit of finding
                the right word in context.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
                >
                  Start Practice
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/15"
                >
                  See how it works
                </a>
              </div>

              {/* Stats grid: high contrast on semi-transparent cards */}
              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.75rem] border border-white/15 bg-slate-900/40 p-5 shadow-lg shadow-slate-950/10 backdrop-blur"
                  >
                    <p className="text-3xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero mockup: positioned on the right with proper alignment */}
            <div className="relative self-center lg:pl-8">
              {/* The layered practice mockup gives the landing page product presence without depending on screenshots or client-side animation. */}
              <div className="relative rounded-[2rem] border border-white/15 bg-[#102846] p-4 shadow-[0_30px_80px_rgba(9,18,33,0.38)]">
              <div className="rounded-[1.65rem] bg-[#f8f9fa] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 rounded-[1.35rem] bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Today&apos;s lesson
                    </p>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Coastal Ecosystems
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    7 min left
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Paragraph exercise</span>
                    <span>Question 6 of 10</span>
                  </div>
                  <p className="mt-4 text-lg leading-8 text-slate-800">
                    Marine scientists explain that a stable coastline depends on
                    diverse vege
                    <span className="rounded-xl bg-blue-600 px-2.5 py-1 font-semibold text-white shadow-sm">
                      t
                    </span>
                    ation, because roots help protect the soil while also
                    reducing the force of moving water.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[1.25rem] bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                        Feedback
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        Correct. <span className="font-semibold text-slate-950">Vegetation</span> fits the ecology topic
                        and matches the noun form suggested by the sentence.
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] bg-[#173154] p-4 text-white shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                        Session score
                      </p>
                      <p className="mt-3 text-3xl font-semibold">84%</p>
                      <p className="mt-1 text-sm leading-6 text-slate-100">
                        Strong context recall. Review environmental vocabulary next.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Accuracy", value: "84%" },
                    { label: "Pace", value: "Fast" },
                    { label: "Streak", value: "11 days" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] bg-white px-4 py-4 text-center shadow-sm ring-1 ring-slate-200"
                    >
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 hidden w-52 rounded-[1.5rem] border border-white/20 bg-[#173154] p-5 text-white shadow-2xl lg:block">
                <p className="text-xs uppercase tracking-[0.22em] text-blue-100">
                  Weekly growth
                </p>
                <p className="mt-3 text-3xl font-semibold">+18%</p>
                <p className="mt-2 text-sm leading-6 text-slate-100">
                  Improvement in academic vocabulary completion over the last 7
                  days.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features section: scroll-mt-[80px] accounts for sticky header height; py-20 for consistent spacing */}
      <section
        id="features"
        className="scroll-mt-[80px] min-h-screen px-6 py-24 sm:px-10 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Features"
            title="A more polished way to practice the exact skill most students overlook"
            description="Instead of separating spelling, vocabulary, and reading comprehension into different drills, the interface brings them together inside one clean daily workflow."
          />

        {/* Solid surfaces and visible borders help each card read clearly against the neutral page background. */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <FeaturePanel feature={features[0]} className="bg-white" />
          <FeaturePanel
            feature={features[1]}
            className="bg-[#173154] text-white"
            invert
          />
          <FeaturePanel feature={features[2]} className="bg-white" />
          <FeaturePanel feature={features[3]} className="bg-slate-50" />
        </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-[80px] min-h-screen bg-[#173154] py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <SectionIntro
            eyebrow="How it works"
            title="Simple enough for everyday use, structured enough for serious progress"
            description="The product flow is intentionally compact so students can practice consistently on busy schedules without losing the feel of real reading passages."
            invert
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[2rem] border border-white/15 bg-white/10 p-8 backdrop-blur"
              >
                <p className="text-sm font-semibold tracking-[0.28em] text-blue-100">
                  {step.number}
                </p>
                <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-100">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Results / Social proof section: scroll-mt-[80px] for header offset, py-20 for spacing */}
      <section
        id="results"
        className="scroll-mt-[80px] min-h-screen px-6 py-24 sm:px-10 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Social proof"
            title="Built to look credible before the first testimonial is even real"
            description="These placeholders are ready to swap for institutional logos, verified student results, or review snippets once you have production data."
          />

        <div className="mt-10 grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:grid-cols-5">
          {logos.map((logo) => (
            <div
              key={logo}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-5 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-600"
            >
              {logo}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
            >
              <p className="text-lg leading-8 text-slate-800">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mt-8 border-t border-slate-200 pt-5">
                <p className="font-semibold text-slate-950">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {testimonial.role}
                </p>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      {/* Pricing section: scroll-mt-[80px] for anchor navigation, py-20 for vertical spacing */}
      <section
        id="pricing"
        className="scroll-mt-[80px] min-h-screen px-6 py-24 sm:px-10 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 rounded-[2.5rem] bg-[#173154] px-6 py-8 text-white shadow-[0_35px_90px_rgba(17,36,63,0.22)] sm:px-8 sm:py-10 lg:grid-cols-[1fr_0.85fr] lg:px-12 lg:py-12">
            <div className="max-w-2xl self-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">
                Pricing
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Start free. Upgrade when students need more daily reps and deeper tracking.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-100">
                This section uses placeholder pricing, but the design is ready for
                real billing plans and a cleaner conversion path to sign-up.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-500"
                >
                  Start Practice
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Explore Features
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] bg-[#0f172a] p-8 ring-1 ring-white/15">
              <p className="text-sm font-medium text-slate-100">Pro plan</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold">$12</span>
                <span className="pb-1 text-slate-100">per month</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-100">
                A simple student plan for consistent weekly practice and richer
                AI-generated sets.
              </p>

              <ul className="mt-8 space-y-4">
                {pricingItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer: dark text on light background for readability */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <p className="text-lg font-semibold text-slate-950">LexiLift</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              TOEFL-style reading and vocabulary practice for students who want
              a cleaner path to higher scores.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-700">
            <a href="#features" className="transition hover:text-slate-950">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-slate-950">
              How it works
            </a>
            <a href="#results" className="transition hover:text-slate-950">
              Results
            </a>
            <a href="#pricing" className="transition hover:text-slate-950">
              Pricing
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  invert?: boolean;
};

function SectionIntro({
  eyebrow,
  title,
  description,
  invert = false,
}: SectionIntroProps) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.28em] ${
          invert ? "text-blue-100" : "text-blue-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-4xl font-semibold tracking-tight sm:text-5xl ${
          invert ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-base leading-7 sm:text-lg ${
          invert ? "text-slate-100" : "text-slate-700"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

type FeaturePanelProps = {
  feature: (typeof features)[number];
  className: string;
  invert?: boolean;
};

function FeaturePanel({
  feature,
  className,
  invert = false,
}: FeaturePanelProps) {
  return (
    <article
      className={`rounded-[2rem] border p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ${
        invert ? "border-white/10" : "border-slate-200"
      } ${className}`}
    >
      <p
        className={`text-sm font-semibold uppercase tracking-[0.24em] ${
          invert ? "text-blue-100" : "text-blue-700"
        }`}
      >
        {feature.eyebrow}
      </p>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight">
        {feature.title}
      </h3>
      <p
        className={`mt-4 max-w-xl text-base leading-7 ${
          invert ? "text-slate-100" : "text-slate-700"
        }`}
      >
        {feature.description}
      </p>
    </article>
  );
}
