+++
title = "Algebraic fractions & formulas"
description = "Simplify and combine algebraic fractions; rearrange formulas in science contexts."
template = "chapter.html"
weight = 2
[extra]
subject = "math"
chapter_id = "algebraic-fractions-formulas"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    An <strong>algebraic fraction</strong> is a fraction whose numerator and denominator are
    polynomials (or monomials). The same ideas you use for numbers — simplify, find a common
    denominator, and combine — apply here, with extra care: you may only cancel
    <strong>common factors</strong>, and you must note values of the variable that would make a
    denominator zero.
  </p>

  <h2 id="prerequisite-recap" class="book-prose__heading">Assumed knowledge recap</h2>
  <p>
    This chapter builds on expanding and factorising polynomials. If you have not studied those
    topics yet, use the callout below as a minimal toolkit.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Before you start</p>
    <ul>
      <li>Expand: \((x+a)(x+b) = x^2 + (a+b)x + ab\).</li>
      <li>
        Factorise quadratics such as \(x^2 + 5x + 6 = (x+2)(x+3)\) (find two numbers that multiply
        to \(6\) and add to \(5\)).
      </li>
      <li>Factorise by common factor: \(6x^2 - 9x = 3x(2x - 3)\).</li>
      <li>
        When simplifying \(\dfrac{P}{Q}\), factorise \(P\) and \(Q\) first, then cancel factors
        that appear in <em>both</em> numerator and denominator — never cancel terms that are only
        added or subtracted.
      </li>
    </ul>
  </div>

  <h2 id="simplify" class="book-prose__heading">Simplifying algebraic fractions</h2>
  <p>
    To simplify, factorise the numerator and denominator completely, then divide out any common
    factors.
  </p>

  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Rule</p>
    <p class="book-formula">
      \[ \frac{ac}{bc} = \frac{a}{b} \quad (b \neq 0,\; c \neq 0) \]
    </p>
    <p>Here \(c\) is a <em>common factor</em> of the top and bottom, not a term added to each.</p>
  </div>

  <p><strong>Example.</strong> Simplify \(\dfrac{x^2 - 1}{x^2 + x}\).</p>
  <p>
    Factorise: \(x^2 - 1 = (x-1)(x+1)\) and \(x^2 + x = x(x+1)\). Cancel the common factor
    \((x+1)\):
    \[ \frac{(x-1)(x+1)}{x(x+1)} = \frac{x-1}{x}, \quad x \neq 0,\; x \neq -1. \]
    The restrictions matter: at \(x = -1\) the original denominator is zero.
  </p>

  <p><strong>Example.</strong> Simplify \(\dfrac{2x^2 - 8}{x^2 - 4}\).</p>
  <p>
    \[ \frac{2(x^2-4)}{x^2-4} = \frac{2(x-2)(x+2)}{(x-2)(x+2)} = 2, \quad x \neq 2,\; x \neq -2. \]
  </p>

  <h2 id="add-subtract" class="book-prose__heading">Adding and subtracting</h2>
  <p>
    Use a <strong>common denominator</strong> (the LCM of the denominators), as with numeric
    fractions.
  </p>

  <p><strong>Example.</strong> \(\dfrac{2}{x} + \dfrac{3}{x+1}\).</p>
  <p>
    LCD is \(x(x+1)\):
    \[ \frac{2}{x} + \frac{3}{x+1} = \frac{2(x+1) + 3x}{x(x+1)} = \frac{5x+2}{x(x+1)}, \quad x \neq 0,\; x \neq -1. \]
  </p>

  <p><strong>Example.</strong> \(\dfrac{1}{x-2} - \dfrac{3}{x^2 - 4}\).</p>
  <p>
    Note \(x^2 - 4 = (x-2)(x+2)\). With LCD \((x-2)(x+2)\):
    \[ \frac{x+2}{(x-2)(x+2)} - \frac{3}{(x-2)(x+2)} = \frac{x-1}{(x-2)(x+2)}, \quad x \neq 2,\; x \neq -2. \]
  </p>

  <h2 id="multiply-divide" class="book-prose__heading">Multiplying and dividing</h2>
  <p>
    Multiply numerators and denominators; factorise before cancelling. To divide, multiply by the
    reciprocal of the divisor.
  </p>

  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Divide</p>
    <p class="book-formula">
      \[ \frac{A}{B} \div \frac{C}{D} = \frac{A}{B} \times \frac{D}{C} \]
    </p>
  </div>

  <p><strong>Example.</strong> \(\dfrac{x^2 - 9}{2x} \times \dfrac{4}{x+3}\).</p>
  <p>
    \[ \frac{(x-3)(x+3)}{2x} \times \frac{4}{x+3} = \frac{4(x-3)}{2x} = \frac{2(x-3)}{x}, \quad x \neq 0,\; x \neq -3. \]
  </p>

  <p><strong>Example.</strong> \(\dfrac{x^2 - 1}{x+1} \div \dfrac{x-1}{2}\).</p>
  <p>
    \[ \frac{(x-1)(x+1)}{x+1} \times \frac{2}{x-1} = 2, \quad x \neq -1,\; x \neq 1. \]
  </p>

  <h2 id="harder-cases" class="book-prose__heading">Harder examples</h2>
  <p>
    These use the same rules; the algebra is longer. Work factorisation and the LCD carefully.
  </p>

  <p><strong>Example.</strong> \(\dfrac{1}{x} + \dfrac{1}{x+1}\) (already seen) gives
    \(\dfrac{5x+2}{x(x+1)}\).</p>

  <p><strong>Example.</strong> Simplify \(\dfrac{x}{x^2 - 5x + 6}\).</p>
  <p>
    Factorise \(x^2 - 5x + 6 = (x-2)(x-3)\):
    \[ \frac{x}{(x-2)(x-3)}, \quad x \neq 2,\; x \neq 3. \]
  </p>

  <h2 id="change-subject" class="book-prose__heading">Changing the subject of a formula</h2>
  <p>
    A <strong>formula</strong> links several quantities. <strong>Changing the subject</strong> means
    rewriting the formula so that one chosen letter stands alone on one side — like solving an
    equation for that letter.
  </p>
  <p>
    Undo operations in <strong>reverse order</strong> to how they build the right-hand side: if the
    target variable is multiplied, divide; if it is inside a bracket, expand or divide through;
    if it appears in a denominator, multiply both sides by that denominator.
  </p>

  <p><strong>Example.</strong> Make \(t\) the subject of \(v = \dfrac{d}{t}\) (\(t \neq 0\)).</p>
  <p>
    Multiply both sides by \(t\): \(vt = d\). Divide by \(v\) (assuming \(v \neq 0\)):
    \[ t = \frac{d}{v}. \]
  </p>

  <p><strong>Example.</strong> Make \(A\) the subject of \(P = \dfrac{F}{A}\) (\(A \neq 0\)).</p>
  <p>
    Multiply by \(A\): \(PA = F\), so \(A = \dfrac{F}{P}\) (\(P \neq 0\)).
  </p>

  <p><strong>Example.</strong> Make \(R\) the subject of \(V = IR\).</p>
  <p>
    Divide by \(I\) (assuming \(I \neq 0\)): \(R = \dfrac{V}{I}\).
  </p>

  <div class="book-table-wrap">
    <table class="book-table">
      <thead>
        <tr>
          <th scope="col">Formula</th>
          <th scope="col">Meaning (typical units)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>\(v = d/t\)</td>
          <td>speed = distance ÷ time</td>
        </tr>
        <tr>
          <td>\(P = F/A\)</td>
          <td>pressure = force ÷ area</td>
        </tr>
        <tr>
          <td>\(V = IR\)</td>
          <td>voltage = current × resistance</td>
        </tr>
        <tr>
          <td>\(\rho = m/V\)</td>
          <td>density = mass ÷ volume</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    For centuries, algebra was written in words. In the 16th and 17th centuries, mathematicians such
    as <strong>François Viète</strong> began to use letters systematically for both unknowns and
    known parameters. That made <strong>formulas</strong> — general relationships such as
    \(v = d/t\) — easy to rearrange without repeating long verbal rules.
  </p>
  <p>
    Rational expressions (fractions built from polynomials) appear whenever you divide one polynomial
    by another. Scientists from <strong>Galileo</strong> onward used ratios and proportionalities in
    motion; later, <strong>Newton’s</strong> laws and electrical laws (e.g. \(V = IR\)) relied on
    changing the subject of a formula to solve for the quantity you can measure.
  </p>
  <p>
    Today, algebraic fractions show up in simplifying models, in calculus limits, and whenever a
    relationship is written as one quantity divided by another.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation</h2>

  <h3 id="why-cancel" class="book-prose__heading">Why can we cancel a common factor?</h3>
  <p>
    If \(c \neq 0\), then \(\dfrac{ac}{bc} = \dfrac{a}{b}\) because multiplying numerator and
    denominator by the same non-zero number does not change the value of a numeric fraction; the
    same idea holds when \(c\) is a polynomial factor shared by top and bottom.
  </p>
  <p>
    You <em>cannot</em> cancel in \(\dfrac{a+c}{b+c}\) in general — that would mean, for example,
    \(\dfrac{1+2}{3+2} = \dfrac{1}{3}\), which is false. Only <strong>factors</strong>, not
    <strong>terms</strong>, may be cancelled.
  </p>

  <h3 id="why-reverse-ops" class="book-prose__heading">Why reverse the order of operations?</h3>
  <p>
    A formula like \(v = d/t\) builds \(v\) by first dividing \(d\) by \(t\). To recover \(t\),
    undo division by multiplying: \(vt = d\), then undo multiplication by \(v\) (when \(v \neq 0\))
    to get \(t = d/v\). Each step reverses one operation that was applied to the subject you want.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <p>
    Pause and reason before continuing. Discuss with a partner or write your work in a notebook.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Simplify \(\dfrac{x^2 - 4}{x + 2}\). What value of \(x\) must be excluded?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Can you cancel the \(x\) in \(\dfrac{x + 1}{x}\)? Explain briefly.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Write \(\dfrac{3}{x} - \dfrac{1}{2x}\) as a single fraction in simplest form.
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Make \(d\) the subject of \(v = \dfrac{d}{t}\). State any conditions on \(t\) and \(v\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      A wire obeys \(V = IR\). If voltage and resistance are known, which formula gives current?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Simplify \(\dfrac{1}{x} + \dfrac{1}{x+1}\). What is the common denominator?
    </p>
  </div>

  <h2 id="applications" class="book-prose__heading">Applications</h2>

  <h3 id="uniform-motion" class="book-prose__heading">Uniform motion</h3>
  <p>
    For constant speed, distance \(d\), speed \(v\), and time \(t\) are related by \(v = d/t\). If a
    train travels \(240\) km in \(3\) h, then \(v = 240/3 = 80\) km/h. If you know \(v\) and \(t\)
  but need distance, rearrange to \(d = vt\).
  </p>

  <div class="math-widget-mount" data-widget="formula-rearrange-demo" data-pagefind-ignore></div>

  <h3 id="density" class="book-prose__heading">Density</h3>
  <p>
    Density \(\rho\) (rho) is mass per unit volume: \(\rho = m/V\). A block of mass \(2.7\) kg with
    volume \(0.001\) m³ has \(\rho = 2.7/0.001 = 2700\) kg/m³. To find mass from \(\rho\) and \(V\),
    use \(m = \rho V\).
  </p>

  <h3 id="pressure-circuits" class="book-prose__heading">Pressure and electric circuits</h3>
  <p>
    Pressure \(P = F/A\) links force \(F\) and area \(A\). Hydraulic and weather models often solve
    for \(F = PA\). In a resistor, \(V = IR\) gives voltage from current and resistance; rearrange
    to \(I = V/R\) when you know voltage and resistance.
  </p>

  <div class="math-widget-mount" data-widget="fraction-simplify-demo" data-pagefind-ignore></div>

  <h2 id="question-bank" class="book-prose__heading">Question bank</h2>
  <p>
    Work each question, then open the solution to check your reasoning. Difficulty increases
    through the sets.
  </p>

  <h3 id="questions-easy" class="book-prose__heading">Easy</h3>

  <details class="book-question">
    <summary class="book-question__prompt">Simplify \(\dfrac{6x}{3x}\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(2\), with \(x \neq 0\).</p>
      <p><strong>Steps:</strong> Cancel the common factor \(3x\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Simplify \(\dfrac{x^2}{x}\) for \(x \neq 0\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(x\).</p>
      <p><strong>Explanation:</strong> Cancel one factor \(x\) from numerator and denominator.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Make \(d\) the subject of \(v = d/t\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(d = vt\) (\(t \neq 0\) when rearranging from the original).</p>
      <p><strong>Steps:</strong> Multiply both sides by \(t\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Make \(R\) the subject of \(V = IR\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(R = V/I\) (\(I \neq 0\)).</p>
      <p><strong>Steps:</strong> Divide both sides by \(I\).</p>
    </div>
  </details>

  <h3 id="questions-intermediate" class="book-prose__heading">Intermediate</h3>

  <details class="book-question">
    <summary class="book-question__prompt">Simplify \(\dfrac{x^2 - 9}{x + 3}\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(x - 3\), with \(x \neq -3\).</p>
      <p><strong>Steps:</strong> \(x^2 - 9 = (x-3)(x+3)\); cancel \((x+3)\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">\(\dfrac{2}{x} + \dfrac{1}{x} = \) ______</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\dfrac{3}{x}\), \(x \neq 0\).</p>
      <p><strong>Explanation:</strong> Same denominator already.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Simplify \(\dfrac{x^2 - 1}{x^2 + x}\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\dfrac{x-1}{x}\), \(x \neq 0,\; x \neq -1\).</p>
      <p><strong>Steps:</strong> Factorise; cancel \((x+1)\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Make \(m\) the subject of \(\rho = m/V\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(m = \rho V\) (\(V \neq 0\) in the original).</p>
      <p><strong>Steps:</strong> Multiply both sides by \(V\).</p>
    </div>
  </details>

  <h3 id="questions-difficult" class="book-prose__heading">Difficult</h3>

  <details class="book-question">
    <summary class="book-question__prompt">\(\dfrac{1}{x} + \dfrac{2}{x+1} = \) ______</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\dfrac{3x+1}{x(x+1)}\), \(x \neq 0,\; x \neq -1\).</p>
      <p><strong>Steps:</strong> LCD \(x(x+1)\); numerator \( (x+1) + 2x = 3x+1\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">\(\dfrac{x}{2} \times \dfrac{4}{x^2} = \) ______</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\dfrac{2}{x}\), \(x \neq 0\).</p>
      <p><strong>Steps:</strong> Multiply; cancel a factor \(x\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Simplify \(\dfrac{1}{x-2} - \dfrac{3}{x^2 - 4}\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\dfrac{x-1}{(x-2)(x+2)}\), \(x \neq 2,\; x \neq -2\).</p>
      <p><strong>Steps:</strong> Write \(x^2-4 = (x-2)(x+2)\); common denominator \((x-2)(x+2)\).</p>
    </div>
  </details>

  <h3 id="questions-hardcore" class="book-prose__heading">Hardcore</h3>

  <details class="book-question">
    <summary class="book-question__prompt">\(\dfrac{x^2 - 1}{x+1} \div \dfrac{x-1}{2} = \) ______</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(2\), with \(x \neq -1,\; x \neq 1\).</p>
      <p><strong>Steps:</strong> Factorise \(x^2-1\); multiply by reciprocal; cancel \((x-1)\) and \((x+1)\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Make \(t\) the subject of \(v = \dfrac{d}{t}\) and then find \(t\) when \(d = 150\) km and \(v = 75\) km/h.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(t = d/v = 2\) h.</p>
      <p><strong>Steps:</strong> \(vt = d \Rightarrow t = d/v\); substitute values.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Simplify fully: \(\dfrac{2x^2 - 8}{x^2 - 4}\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(2\), \(x \neq 2,\; x \neq -2\).</p>
      <p><strong>Steps:</strong> Factorise numerator \(2(x^2-4)\) and denominator \((x-2)(x+2)\); cancel \((x-2)(x+2)\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">A formula is \(P = \dfrac{F}{A}\). The force is \(120\) N and the area is \(0.05\) m². Find \(P\), then make \(F\) the subject and verify your force value.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(P = 120/0.05 = 2400\) Pa; \(F = PA = 2400 \times 0.05 = 120\) N.</p>
      <p><strong>Explanation:</strong> Rearranging checks that the formula is consistent.</p>
    </div>
  </details>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Viète, <em>In artem analyticem isagoge</em> (1591) — early systematic use of letters in algebra.</li>
    <li>HKDSE Compulsory Part — Number and Algebra (algebraic fractions, formulas and identities).</li>
  </ul>
</div>
