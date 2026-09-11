export const CONSULTING_INBOX = 'agbonorino@proton.me';

export interface ConsultingLink {
  label: string;
  href: string;
}

export interface ConsultingNode {
  id: '01' | '02' | '03';
  title: string;
  question: string;
  body: string;
  links: ConsultingLink[];
  /** Percentage position within the net pane. */
  x: number;
  y: number;
  lead?: boolean;
}

export const NODES: ConsultingNode[] = [
  {
    id: '01',
    title: 'Fit to rely',
    question: 'Is this system fit to release or rely on?',
    body: 'Independent evaluation of a research, RAG, or agent system for a named use. Frozen tests, a failure register, and an evidence pack another reviewer can rerun. Advisory, not a certification.',
    links: [
      { label: 'Learn more', href: '#' },
      { label: 'Demonstration', href: 'https://github.com/Cognitio-EDU/Silicus-TA-2.0' },
    ],
    x: 50,
    y: 24,
    lead: true,
  },
  {
    id: '02',
    title: 'Did it change',
    question: 'Did the intervention change the outcome?',
    body: 'Estimand, design, contamination, power, and a decision memo — before you spend or claim.',
    links: [
      { label: 'Learn more', href: '#' },
      {
        label: 'Replication',
        href: 'https://github.com/Bonorinoa/economics-of-water-scarcity-replication',
      },
    ],
    x: 22,
    y: 74,
  },
  {
    id: '03',
    title: 'Does it measure',
    question: 'Does the score measure what the decision assumes?',
    body: 'A construct map, an allowed-use boundary, and a test against held-out human evidence. Distinctive depth, not the lead offer.',
    links: [
      {
        label: 'Learn more',
        href: 'https://augustogbonorino.substack.com/p/construct-identified-inference',
      },
      { label: 'Paper', href: 'https://arxiv.org/abs/2501.06834' },
    ],
    x: 78,
    y: 74,
  },
];

export const EDGES: Array<[ConsultingNode['id'], ConsultingNode['id']]> = [
  ['01', '02'],
  ['01', '03'],
  ['02', '03'],
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
    href: '#',
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
