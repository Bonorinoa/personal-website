export const CONSULTING_INBOX = 'agbonorino@proton.me';
export const CALENDLY_LINK = 'https://calendly.com/agbonorino-proton';

export interface ConsultingLink {
  label: string;
  href?: string;
}

export interface ConsultingNode {
  id: '01' | '02' | '03';
  title: string;
  scope: string;
  question: string;
  body: string;
  reduction: string;
  /** Plain-language gloss for notation used in this stage. */
  glosses?: string[];
  /** Plain sentence shown right after the body. */
  bodyNote?: string;
  /** One plain "For example:" line. */
  example?: string;
  links: ConsultingLink[];
}

export const NODES: ConsultingNode[] = [
  {
    id: '01',
    title: 'Upstream',
    scope: 'define the construct · generate measures · process data',
    question: "We need to measure something we can't observe yet",
    body: "Before you build a measure, I review the construct and the candidate measures — what each one can and can't capture — and check the processing chain for provenance, so a reviewer can see where each number came from.",
    reduction: 'which measure is worth building first.',
    glosses: ["Construct — the thing you want to measure but can't observe directly, like trust or wellbeing."],
    example:
      "For example: a city wants a 'neighborhood trust' score from survey items and 311 calls. Which items belong, and which only measure who answers surveys?",
    links: [],
  },
  {
    id: '02',
    title: 'Midstream',
    scope: 'specification & multiverse analysis · admissible set M*',
    question: "Is our measure entitled to the claim we're making?",
    body: 'Construct validity as partial identification: the admissible measurement set M*, and the range of conclusions your assumptions actually permit. An empty set is a finding.',
    reduction: 'which measure is load-bearing — remove it and the conclusion moves — and which to drop.',
    bodyNote: "An empty set means no measure fits all your assumptions — so the claim, as stated, isn't supported.",
    glosses: ["M* — the set of measures your assumptions can't rule out."],
    example:
      "For example: a team's 'cultural fit' index drives a hiring screen. Does the claim survive if one survey item is dropped?",
    links: [
      {
        label: 'Construct-Identified Inference',
        href: 'https://augustogbonorino.substack.com/p/construct-identified-inference',
      },
      { label: 'cvprofiles (open source)', href: 'https://github.com/Bonorinoa/cvprofiles' },
      { label: 'Interactive demo', href: 'https://cvprofiles-demo.streamlit.app/' },
    ],
  },
  {
    id: '03',
    title: 'Downstream',
    scope: 'estimand · estimator · identified range [L,U] · robustness',
    question: 'Is the number defensible — and what do we do?',
    body: 'I check what the estimate is actually measuring and how sturdy it is, then translate the range into a decision: act now, act with a hedge, or collect one more thing first — plus a plain statement of what the evidence does not establish.',
    reduction: 'what to collect next to shrink the range.',
    glosses: ['[L, U] — the range of answers the data allows, from lowest (L) to highest (U).'],
    example:
      'For example: a program evaluation gives a 4–11% effect. Is the low end still worth the budget, or is one more data source cheaper than being wrong?',
    links: [],
  },
];

export interface WritingItem {
  kind: string;
  title: string;
  href: string;
  blurb: string;
}

export const WRITING: WritingItem[] = [
  {
    kind: 'Substack',
    title: 'Construct-Identified Inference',
    href: 'https://augustogbonorino.substack.com/p/construct-identified-inference',
    blurb: 'Measurement, specification, and sampling as three separate uncertainties.',
  },
  {
    kind: 'Preprint',
    title: 'Synthetic Cultural Agents',
    href: 'https://arxiv.org/abs/2501.06834',
    blurb: 'Whether simulated respondents preserve human patterns. Failures included.',
  },
  {
    kind: 'Column',
    title: 'La Gaceta · ADEPA',
    href: 'https://www.lagaceta.com.ar/nota/1153651/opinion/cartas-lectores-verificacion-social.html',
    blurb: 'Opinion writing in La Gaceta (Tucumán) on checking claims against local context and public data.',
  },
];

export const METHOD_ESSAY_LINK = 'https://augustogbonorino.substack.com/p/construct-identified-inference';

export const INTRO =
  "For research leads, policy teams and data teams who are about to act on a number: a second look at whether the evidence supports the decision, before it's made.";

export const DEMOS_LINE =
  'Worked examples for this stage are in progress. For now, this essay walks through the method.';

export const WHAT_YOU_GET: { id: string; title: string; line: string }[] = [
  { id: '01', title: 'A call', line: 'A 20-minute call about the question and the data behind it.' },
  { id: '02', title: 'A written memo', line: "A short written memo on what the evidence supports, what it doesn't, and which measure carries the result." },
  { id: '03', title: 'Next steps', line: 'A plain list of what to collect next to narrow the answer.' },
];

export interface Note {
  quote: string;
  name: string;
  /** e.g. "Role, Org" */
  role: string;
  /** e.g. "Midstream" */
  stage?: string;
}

/**
 * Real client notes only. The section renders only when at least two exist.
 * Never add placeholder or invented entries here. Format example (commented out on purpose):
 *
 * {
 *   quote: 'Example quote text.',
 *   name: 'Jane Doe',
 *   role: 'Research Lead, Example Org',
 *   stage: 'Midstream',
 * },
 */
export const NOTES: Note[] = [];
