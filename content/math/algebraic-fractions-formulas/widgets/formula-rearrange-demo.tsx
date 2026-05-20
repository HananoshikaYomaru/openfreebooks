import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal, For } from "solid-js";

type FormulaId = "speed" | "density" | "ohm";
type SubjectId = string;

type FormulaDef = {
  id: FormulaId;
  label: string;
  defaultSubject: SubjectId;
  subjects: { id: SubjectId; label: string; result: string; steps: string[] }[];
};

const FORMULAS: FormulaDef[] = [
  {
    id: "speed",
    label: "Speed — v = d/t",
    defaultSubject: "t",
    subjects: [
      {
        id: "t",
        label: "Make t the subject",
        result: String.raw`t = \frac{d}{v}`,
        steps: [
          String.raw`\text{Start: } v = \frac{d}{t}`,
          String.raw`\text{Multiply both sides by } t \Rightarrow vt = d`,
          String.raw`\text{Divide by } v \Rightarrow t = \frac{d}{v} \quad (v \neq 0)`,
        ],
      },
      {
        id: "d",
        label: "Make d the subject",
        result: String.raw`d = vt`,
        steps: [
          String.raw`\text{Start: } v = \frac{d}{t}`,
          String.raw`\text{Multiply both sides by } t \Rightarrow d = vt`,
        ],
      },
      {
        id: "v",
        label: "Make v the subject",
        result: String.raw`v = \frac{d}{t}`,
        steps: [String.raw`\text{Already solved for } v \text{ ( } t \neq 0 \text{)}`],
      },
    ],
  },
  {
    id: "density",
    label: "Density — ρ = m/V",
    defaultSubject: "m",
    subjects: [
      {
        id: "m",
        label: "Make m the subject",
        result: String.raw`m = \rho V`,
        steps: [
          String.raw`\text{Start: } \rho = \frac{m}{V}`,
          String.raw`\text{Multiply both sides by } V \Rightarrow m = \rho V`,
        ],
      },
      {
        id: "V",
        label: "Make V the subject",
        result: String.raw`V = \frac{m}{\rho}`,
        steps: [
          String.raw`\text{Start: } \rho = \frac{m}{V}`,
          String.raw`\text{Multiply by } V,\ \text{divide by } \rho \Rightarrow V = \frac{m}{\rho} \quad (\rho \neq 0)`,
        ],
      },
      {
        id: "rho",
        label: "Make ρ the subject",
        result: String.raw`\rho = \frac{m}{V}`,
        steps: [String.raw`\text{Already solved for } \rho \text{ ( } V \neq 0 \text{)}`],
      },
    ],
  },
  {
    id: "ohm",
    label: "Voltage — V = IR",
    defaultSubject: "R",
    subjects: [
      {
        id: "R",
        label: "Make R the subject",
        result: String.raw`R = \frac{V}{I}`,
        steps: [
          String.raw`\text{Start: } V = IR`,
          String.raw`\text{Divide both sides by } I \Rightarrow R = \frac{V}{I} \quad (I \neq 0)`,
        ],
      },
      {
        id: "I",
        label: "Make I the subject",
        result: String.raw`I = \frac{V}{R}`,
        steps: [
          String.raw`\text{Start: } V = IR`,
          String.raw`\text{Divide both sides by } R \Rightarrow I = \frac{V}{R} \quad (R \neq 0)`,
        ],
      },
      {
        id: "V",
        label: "Make V the subject",
        result: String.raw`V = IR`,
        steps: [String.raw`\text{Already solved for } V`],
      },
    ],
  },
];

function FormulaRearrangeDemo() {
  const [formulaId, setFormulaId] = createSignal<FormulaId>("speed");
  const [subjectId, setSubjectId] = createSignal<SubjectId>("t");

  const formula = createMemo(() => FORMULAS.find((f) => f.id === formulaId()) ?? FORMULAS[0]);
  const subject = createMemo(
    () => formula().subjects.find((s) => s.id === subjectId()) ?? formula().subjects[0]
  );

  const resultHtml = createMemo(() => renderLatex(subject().result, { displayMode: true }));

  const onFormulaChange = (id: FormulaId) => {
    setFormulaId(id);
    const f = FORMULAS.find((x) => x.id === id);
    if (f) setSubjectId(f.defaultSubject);
  };

  return (
    <section
      class="scenario-demo scenario-demo--formula-rearrange"
      aria-label="Rearranging a science formula"
    >
      <div class="scenario-demo__stage scenario-demo__stage--wide">
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="formula-pick">
            <span>Formula</span>
          </label>
          <select
            id="formula-pick"
            class="formula-rearrange-demo__select"
            value={formulaId()}
            onChange={(e) => onFormulaChange(e.currentTarget.value as FormulaId)}
          >
            <For each={FORMULAS}>{(f) => <option value={f.id}>{f.label}</option>}</For>
          </select>
        </div>
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="subject-pick">
            <span>Target variable</span>
          </label>
          <select
            id="subject-pick"
            class="formula-rearrange-demo__select"
            value={subjectId()}
            onChange={(e) => setSubjectId(e.currentTarget.value)}
          >
            <For each={formula().subjects}>{(s) => <option value={s.id}>{s.label}</option>}</For>
          </select>
        </div>
        <ol class="formula-rearrange-demo__steps">
          <For each={subject().steps}>
            {(step) => (
              <li>
                <div class="scenario-demo__formula scenario-demo__formula--inline" innerHTML={renderLatex(step)} />
              </li>
            )}
          </For>
        </ol>
      </div>
      <div class="scenario-demo__panel">
        <p class="scenario-demo__live" aria-live="polite">
          Result:
        </p>
        <div class="scenario-demo__formula" innerHTML={resultHtml()} aria-live="polite" />
      </div>
    </section>
  );
}

export default FormulaRearrangeDemo;
