import type { Metadata } from 'next';
import Link from 'next/link';
import Article from '../../../components/Article';
import { Code } from '../../../components/ui';

export const metadata: Metadata = {
  title: 'Model output is untrusted input',
  description: 'Why Pathway validates every field of a language model’s JSON response on the server, and how the prompt and the validator enforce the same rule.',
  alternates: { canonical: '/notes/model-output-is-untrusted-input/' },
  openGraph: { type: 'article', title: 'Model output is untrusted input', url: '/notes/model-output-is-untrusted-input/', images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: 'Aarav Jit' }] },
};

const sanitize = `function sanitizeResult(value: unknown): JobFitResult {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const rawScore = typeof source.overallScore === "number" ? source.overallScore : 0;
  const allowedVerdicts = new Set(["ready", "competitive", "stretch", "gap"]);
  const verdict = allowedVerdicts.has(String(source.verdict))
    ? (source.verdict as JobFitResult["verdict"])
    : "gap";

  return {
    roleTitle: typeof source.roleTitle === "string" ? source.roleTitle.trim().slice(0, 120) : "",
    overallScore: Math.max(0, Math.min(100, Math.round(rawScore))),
    verdict,
    evidenceMatched: cleanEvidenceMatches(source.evidenceMatched),  // drops malformed items, max 6
    actualGaps: cleanStringArray(source.actualGaps),
    // ...every other field is checked the same way
  };
}`;

const rules = `Rules:
- Never invent experience, credentials, tools, metrics, or education.
- Separate missing resume language from genuinely missing qualifications.
- Do not treat every preferred qualification as mandatory.
- Explain blockers plainly. Do not flatter the candidate.
- The score is decision support, not an ATS prediction.`;

export default function Note() {
  return (
    <Article slug="model-output-is-untrusted-input">
      <p>Pathway compares a resume with a job posting and returns a fit score, a verdict, the evidence it matched and the gaps it found. That result comes from the OpenAI Responses API, asked for strict JSON. It would be easy to parse the response and hand it straight to the UI. Pathway doesn’t, for the same reason a web server doesn’t trust a form submission.</p>

      <h2>A schema request is not a contract</h2>
      <p>Requesting a JSON shape makes the right shape likely, not certain. In practice the failure modes are mundane: a field missing, a number as a string, a score outside 0–100, a verdict that isn’t one of the four the UI knows how to render, a list with twelve items where the layout expects six, or an evidence entry missing the quote it is supposed to cite. Any of these, rendered directly, is either a crash or a confident-looking wrong answer.</p>

      <h2>Validate every field, degrade to safe defaults</h2>
      <p>The job-fit route runs the parsed JSON through a sanitizer before anything else sees it. Each field is type-checked; strings are trimmed and length-limited; the score is rounded and clamped; the verdict is checked against an allow-list and falls back to the most conservative value, <code>gap</code>; lists are filtered for well-formed items and capped.</p>
      <Code file="app/api/job-fit/route.ts (private repository)" code={sanitize} />
      <p>Two choices matter here. First, the fallback verdict is the pessimistic one, so a malformed response can make a role look like a worse fit but never a better one. Second, the function accepts <code>unknown</code>, which forces every access to be checked; the TypeScript type describes the output, not the input.</p>

      <h2>The prompt carries the same rule</h2>
      <p>Validation can enforce shape, not truth. Whether an “evidence matched” item actually appears in the resume is a semantic property, so the prompt states the product’s core rule directly. These lines are copied from it:</p>
      <Code file="job-fit system prompt (excerpt)" code={rules} />
      <p>The prompt and the validator are two halves of one policy: the prompt makes honest output likely, and the validator makes malformed output harmless.</p>

      <h2>What this doesn’t solve</h2>
      <p>The sanitizer can’t tell whether a well-formed claim is true. A stronger version would check each matched-evidence quote against the uploaded resume text and drop anything that doesn’t appear in it; I haven’t built that yet. The score also remains a model’s judgment, which is why the prompt and the UI both describe it as decision support rather than a prediction.</p>
      <p>More on the project in the <Link href="/projects/pathway/">Pathway case study</Link>.</p>
    </Article>
  );
}
