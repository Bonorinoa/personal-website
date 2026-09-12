import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CONSULTING_INBOX } from '@/data/consulting';
import { supabase } from '@/integrations/supabase/client';

const fieldClass =
  'mt-2 w-full rounded-[2px] bg-[hsl(var(--paper))] border border-[hsl(var(--rule))] px-3 py-2 text-[15px] text-foreground outline-none focus:border-[hsl(var(--oxblood))] transition-colors';

const labelClass = 'font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-ink))]';

export function DecisionForm() {
  const [decision, setDecision] = useState('');
  const [deadline, setDeadline] = useState('');
  const [cost, setCost] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const mailtoFallback = () => {
    const body = [
      'What decision?',
      decision,
      '',
      'Deadline',
      deadline,
      '',
      'Cost of being wrong',
      cost,
      '',
      'Reply to',
      email || '(not provided)',
    ].join('\n');

    return `mailto:${CONSULTING_INBOX}?subject=${encodeURIComponent(
      'Describe a decision',
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const { error } = await supabase.from('consulting_inquiries').insert({
      decision: decision.trim(),
      deadline: deadline.trim(),
      cost: cost.trim(),
      email: email.trim() || null,
    });

    if (error) {
      console.error('[consulting] submission failed:', error.message);
      setStatus('error');
      return;
    }

    setStatus('sent');
    setDecision('');
    setDeadline('');
    setCost('');
    setEmail('');
  };

  if (status === 'sent') {
    return (
      <div className="max-w-xl">
        <p className="font-serif text-[17px] text-foreground">Received.</p>
        <p className="mt-2 font-serif italic text-[14px] text-[hsl(var(--muted-ink))]">
          I read these myself and reply within a couple of days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="decision">
            What decision?
          </label>
          <textarea
            id="decision"
            required
            rows={3}
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="deadline">
            Deadline
          </label>
          <input
            id="deadline"
            required
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="cost">
            Cost of being wrong
          </label>
          <textarea
            id="cost"
            required
            rows={3}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Your email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="outline"
        className="mt-7 min-h-[44px] rounded-[2px] border-[hsl(var(--oxblood))] bg-transparent px-5 text-[14px] font-normal tracking-wide text-[hsl(var(--oxblood))] hover:bg-[hsl(var(--oxblood))] hover:text-[hsl(var(--paper))]"
      >
        Describe a decision
      </Button>

      <p className="mt-3 font-serif italic text-[14px] text-[hsl(var(--muted-ink))]">
        Twenty minutes. Deadline and cost of being wrong, not a pitch deck.
      </p>
    </form>
  );
}
