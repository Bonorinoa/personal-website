export const CONSULTING_INBOX = 'agbonorino@proton.me';

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
  links: ConsultingLink[];
}

export const NODES: ConsultingNode[] = [
  {
    id: '01',
    title: 'Upstream',
    scope: 'define the construct · generate measures · process data',
    question: "We need to measure something we can't observe yet",
    body: 'I define the construct, propose candidate measures, and build the processing chain — with provenance on every transformation, so a reviewer can see where each number came from.',
    reduction: 'which measure is worth building first.',
    links: [],
  },
  {
    id: '02',
    title: 'Midstream',
    scope: 'specification & multiverse analysis · admissible set M*',
    question: "Is our measure entitled to the claim we're making?",
    body: 'Construct validity as partial identification: the admissible measurement set M*, and the range of conclusions your assumptions actually permit. An empty set is a finding.',
    reduction: 'which measure is load-bearing — remove it and the conclusion moves — and which to drop.',
    links: [
      {
        label: 'Construct-Identified Inference',
        href: 'https://augustogbonorino.substack.com/p/construct-identified-inference',
      },
      { label: 'cvprofiles (open source)', href: 'https://github.com/Bonorinoa/cvprofiles' },
      { label: 'Interactive demo — in build' },
    ],
  },
  {
    id: '03',
    title: 'Downstream',
    scope: 'estimand · estimator · identified range [L,U] · robustness',
    question: 'Is the number defensible — and what do we do?',
    body: 'Estimand, estimator, estimate, then the robustness work — including an explicit statement of what the evidence does not establish.',
    reduction: 'what to collect next to shrink the range.',
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
    kind: 'Journal',
    title: 'Synthetic Cultural Agents',
    href: 'https://arxiv.org/abs/2501.06834',
    blurb: 'Whether simulated respondents preserve human patterns. Failures included.',
  },
  {
    kind: 'Column',
    title: 'La Gaceta · ADEPA',
    href: 'https://www.lagaceta.com.ar/nota/1153651/opinion/cartas-lectores-verificacion-social.html',
    blurb: 'Public writing, not a service tile.',
  },
];

export interface Note {
  quote: string;
  name: string;
  role: string;
}

/** Rendered only when at least two real notes exist. */
export const NOTES: Note[] = [];
