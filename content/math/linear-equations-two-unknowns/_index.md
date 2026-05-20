+++
title = "Linear equations in two unknowns"
description = "Solve pairs of linear equations by substitution, elimination, and graphs; classify unique, parallel, and coincident cases."
template = "chapter.html"
weight = 10
[extra]
subject = "math"
chapter_id = "linear-equations-two-unknowns"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    A <strong>system of linear equations in two unknowns</strong> is a pair of equations in
    variables \(x\) and \(y\), where each equation is linear (the highest power of each variable is
    1). A <strong>solution</strong> is an ordered pair \((x, y)\) that satisfies
    <em>both</em> equations at the same time.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Assumed knowledge</p>
    <ul>
      <li>Expand and collect like terms, e.g. \(2(x+3) = 2x + 6\).</li>
      <li>Substitute a value into an expression, e.g. replace \(x\) by \(4\) in \(3x - 1\).</li>
      <li>Add or subtract equations term by term when both sides are equal.</li>
    </ul>
  </div>

  <h2 id="standard-form" class="book-prose__heading">Standard form</h2>
  <p>
    A convenient form is
    \[ ax + by = c, \qquad dx + ey = f, \]
    where \(a, b, c, d, e, f\) are constants. The same system can be written in other equivalent
    forms — for example \(y = 2x + 1\) is the same as \(-2x + y = 1\).
  </p>

  <h2 id="substitution" class="book-prose__heading">Substitution</h2>
  <p>
    <strong>Substitution</strong> means isolate one unknown in one equation, then replace that
    expression in the other equation.
  </p>
  <p><strong>Example.</strong> Solve</p>
  <p class="book-formula">
    \[ \begin{cases} y = 2x + 1 \\ x + y = 7 \end{cases} \]
  </p>
  <p>
    From the first equation, \(y = 2x + 1\). Substitute into the second:
    \[ x + (2x + 1) = 7 \Rightarrow 3x + 1 = 7 \Rightarrow 3x = 6 \Rightarrow x = 2. \]
    Then \(y = 2(2) + 1 = 5\). The solution is \((2, 5)\).
  </p>
  <p>
    Check: \(2(2)+1 = 5\) and \(2 + 5 = 7\).
  </p>

  <h2 id="elimination" class="book-prose__heading">Elimination</h2>
  <p>
    <strong>Elimination</strong> adds or subtracts the equations so that one unknown cancels. You
    may need to multiply one or both equations first so that the coefficients of \(x\) or \(y\) match
    in size (one positive, one negative).
  </p>
  <p><strong>Example.</strong> Solve</p>
  <p class="book-formula">
    \[ \begin{cases} x + y = 5 \\ 2x - y = 1 \end{cases} \]
  </p>
  <p>
    The coefficients of \(y\) are \(1\) and \(-1\), so add the equations:
    \[ (x+y) + (2x-y) = 5 + 1 \Rightarrow 3x = 6 \Rightarrow x = 2. \]
    Substitute into \(x + y = 5\): \(2 + y = 5\), so \(y = 3\). Solution: \((2, 3)\).
  </p>

  <h2 id="graphical" class="book-prose__heading">Graphical interpretation</h2>
  <p>
    Each equation \(ax + by = c\) (with \(b \neq 0\)) can be rearranged to
    \(y = -\frac{a}{b}x + \frac{c}{b}\), which is a straight line. The solution of the system is
    the point where the two lines meet — their <strong>intersection</strong>.
  </p>
  <div class="book-table-wrap">
    <table class="book-table">
      <thead>
        <tr>
          <th scope="col">Lines</th>
          <th scope="col">Algebraic picture</th>
          <th scope="col">Solutions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Intersect at one point</td>
          <td>Different slopes</td>
          <td>Exactly one \((x, y)\)</td>
        </tr>
        <tr>
          <td>Parallel, distinct</td>
          <td>Same slope, different intercepts</td>
          <td>No solution</td>
        </tr>
        <tr>
          <td>Coincident (same line)</td>
          <td>One equation is a multiple of the other</td>
          <td>Infinitely many</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 id="try-graph" class="book-prose__heading">Try it — graph explorer</h2>
  <p>
    Adjust the two lines or use presets. Read off the intersection and how the classification changes
    when the lines are parallel or coincident.
  </p>
</div>

<div class="math-widget-mount" data-widget="simultaneous-graph-explorer" data-pagefind-ignore></div>

<div class="book-prose">
  <h2 id="try-solver" class="book-prose__heading">Try it — step-by-step solver</h2>
  <p>
    Pick a preset system and watch substitution or elimination steps. Systems with no unique
    solution show an explanation instead of incorrect steps.
  </p>
</div>

<div class="math-widget-mount" data-widget="simultaneous-solver-workbench" data-pagefind-ignore></div>

<div class="book-prose">
  <h2 id="word-problems" class="book-prose__heading">Word problems</h2>
  <p>
    For story problems, define unknowns clearly, write <em>two</em> independent equations, then solve
    by substitution, elimination, or a graph.
  </p>
  <p><strong>Example (tickets).</strong> Adult tickets cost \$12 and child tickets \$7. A group buys
    10 tickets for \$95. How many of each type?</p>
  <p>
    Let \(a\) be the number of adult tickets and \(c\) the number of child tickets. Then
    \(a + c = 10\) and \(12a + 7c = 95\). From the first, \(c = 10 - a\). Substitute:
    \[ 12a + 7(10 - a) = 95 \Rightarrow 12a + 70 - 7a = 95 \Rightarrow 5a = 25 \Rightarrow a = 5, \]
    so \(c = 5\). Five adult and five child tickets.
  </p>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Problems that need two unknowns at once are ancient. The Chinese text
    <em>Nine Chapters on the Mathematical Art</em> (around 200&nbsp;BCE, with later commentary)
    includes <strong>fangcheng</strong> methods — arranging coefficients in a table and eliminating
    unknowns, much like modern elimination.
  </p>
  <p>
    In the 9th century, <strong>al-Khwarizmi</strong> organised linear and quadratic problems in
    systematic rules that spread to Europe. By the 17th century, <strong>Descartes</strong> linked
    algebra with geometry: an equation in \(x\) and \(y\) describes a curve, so solving a system is
    finding where two curves meet. Today, computers solve huge systems, but the same ideas — replace,
    combine, or intersect — remain the core of school algebra.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation</h2>

  <h3 id="why-elimination" class="book-prose__heading">Why elimination preserves solutions</h3>
  <p>
    If \((x_0, y_0)\) satisfies both \(ax + by = c\) and \(dx + ey = f\), then any
    <em>linear combination</em> of the two equations is still true at \((x_0, y_0)\). For example,
    adding the left sides and adding the right sides gives
    \[ (a+d)x + (b+e)y = c + f, \]
    which \((x_0, y_0)\) also satisfies. Elimination chooses combinations so one unknown disappears,
    leaving a single equation in one unknown. Multiplying an equation by a non-zero constant before
    adding does not change the solution set either.
  </p>

  <h3 id="why-intersection" class="book-prose__heading">Why the graph solution is the intersection</h3>
  <p>
    The graph of \(ax + by = c\) is all points \((x, y)\) that make the equation true. A solution of
    the <em>system</em> must lie on <em>both</em> graphs, so it must be a point common to both lines.
    If the lines cross once, that point is the unique solution; if they never meet, there is no
    solution; if they are the same line, every point on the line works.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <p>
    Pause and reason before continuing. Discuss with a partner or write your work in a notebook.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      In the graph explorer, use the “Parallel” preset. What does the status panel say about
      solutions? Does the canvas show an intersection point?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Solve \(y = 3x - 2\) and \(2x + y = 8\) by substitution without a calculator. Does your pair
      \((x, y)\) satisfy both originals?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      For \(x + 2y = 8\) and \(2x + 4y = 16\), are the two equations independent, or is one a
      multiple of the other? How many solutions do you expect?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      When eliminating, why do we sometimes <em>subtract</em> equations instead of add them? Give an
      example where subtracting cancels \(x\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      A shop sells notebooks for \$4 and pens for \$2. You buy 6 items for \$18. What two equations
      describe this? Which method would you use first?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      In the step-by-step workbench, run elimination on the ticket-style preset. At which step does
      \(y\) (or your chosen variable) disappear?
    </p>
  </div>

  <h2 id="applications" class="book-prose__heading">Applications</h2>

  <h3 id="ticket-pricing" class="book-prose__heading">Ticket pricing</h3>
  <p>
    Cinemas and transport systems often use different prices for adults and children. If you know the
    total number of tickets and the total cost, you have two equations in two unknowns — the counts
    of each type. The same structure appears in fundraising dinners (plate vs concession) and sports
    seating.
  </p>

  <h3 id="mixtures" class="book-prose__heading">Mixtures and concentrations</h3>
  <p>
    A chemist may mix a \(20\%\) solution with a \(50\%\) solution to obtain 2&nbsp;L of
    \(35\%\) solution. Let \(x\) and \(y\) be the volumes (in litres) of the weaker and stronger
    solutions. Then \(x + y = 2\) (total volume) and \(0.2x + 0.5y = 0.35 \times 2\) (total amount
    of pure solute). Solving the system gives the recipe.
  </p>

  <h3 id="break-even" class="book-prose__heading">Two constraints in business</h3>
  <p>
    A small business might need at least 100 units to cover fixed costs and also stay within a
    production cap of 150 units while hitting a revenue target. Each constraint is linear; the
    feasible plan is where the constraints overlap — a preview of ideas used later in linear
    programming.
  </p>

  <h2 id="question-bank" class="book-prose__heading">Question bank</h2>
  <p>
    Work each question, then open the solution to check your reasoning. Difficulty increases through
    the sets.
  </p>

  <h3 id="questions-easy" class="book-prose__heading">Easy</h3>

  <details class="book-question">
    <summary class="book-question__prompt">Solve by substitution: \(y = x + 2\) and \(x + y = 8\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((3, 5)\).</p>
      <p><strong>Steps:</strong> Substitute \(y = x + 2\) into \(x + y = 8\): \(x + (x+2) = 8\), so \(2x = 6\), \(x = 3\), \(y = 5\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Solve by elimination: \(x + y = 6\) and \(x - y = 2\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((4, 2)\).</p>
      <p><strong>Steps:</strong> Add: \(2x = 8\), \(x = 4\). Then \(y = 6 - 4 = 2\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Is \((1, 2)\) a solution of \(2x + y = 4\) and \(x - y = -1\)?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Yes.</p>
      <p><strong>Check:</strong> \(2(1)+2 = 4\) and \(1 - 2 = -1\).</p>
    </div>
  </details>

  <h3 id="questions-intermediate" class="book-prose__heading">Intermediate</h3>

  <details class="book-question">
    <summary class="book-question__prompt">Solve: \(2x + y = 7\) and \(x - y = 2\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((3, 1)\).</p>
      <p><strong>Steps:</strong> Add equations: \(3x = 9\), \(x = 3\). Then \(3 - y = 2\), \(y = 1\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Solve: \(3x + 2y = 12\) and \(x + y = 5\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((2, 3)\).</p>
      <p><strong>Steps:</strong> From \(x + y = 5\), \(y = 5 - x\). Substitute: \(3x + 2(5-x) = 12\), \(3x + 10 - 2x = 12\), \(x = 2\), \(y = 3\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Two lines have equations \(y = 2x + 1\) and \(y = 2x - 3\). How many solutions does the system have?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> No solution (parallel lines).</p>
      <p><strong>Explanation:</strong> Same slope \(2\), different intercepts — the lines never meet.</p>
    </div>
  </details>

  <h3 id="questions-difficult" class="book-prose__heading">Difficult</h3>

  <details class="book-question">
    <summary class="book-question__prompt">Solve: \(2x + 3y = 13\) and \(4x - y = 5\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((2, 3)\).</p>
      <p><strong>Steps:</strong> From \(4x - y = 5\), \(y = 4x - 5\). Substitute into \(2x + 3y = 13\): \(2x + 3(4x-5) = 13\), \(2x + 12x - 15 = 13\), \(14x = 28\), \(x = 2\), \(y = 3\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Eliminate \(x\): \(3x + 2y = 11\) and \(5x - 2y = 13\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((3, 1)\).</p>
      <p><strong>Steps:</strong> Add equations: \(8x = 24\), \(x = 3\). Then \(3(3) + 2y = 11\), \(2y = 2\), \(y = 1\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">A purse has 12 coins, all 5¢ or 10¢, with total value 95¢. How many of each?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> 5 coins at 5¢ and 7 coins at 10¢.</p>
      <p><strong>Steps:</strong> Let \(n\) be 5¢ coins and \(m\) be 10¢ coins. Then \(n + m = 12\) and \(5n + 10m = 95\). From the first, \(n = 12 - m\). Substitute: \(5(12-m) + 10m = 95\), \(60 - 5m + 10m = 95\), \(5m = 35\), \(m = 7\), \(n = 5\).</p>
    </div>
  </details>

  <h3 id="questions-hardcore" class="book-prose__heading">Hardcore</h3>

  <details class="book-question">
    <summary class="book-question__prompt">For what value of \(k\) does \(x + ky = 4\) and \(2x + 2ky = 8\) have infinitely many solutions?</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Every \(k\) (the second equation is \(2\times\) the first).</p>
      <p><strong>Explanation:</strong> The lines are coincident for all \(k\) where the second is a multiple of the first; here they are always multiples, so infinitely many solutions.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Solve: \(\dfrac{x}{2} + y = 5\) and \(x - y = 1\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \((4, 3)\).</p>
      <p><strong>Steps:</strong> Multiply the first equation by 2: \(x + 2y = 10\). With \(x - y = 1\), substitute \(x = 1 + y\) into \(x + 2y = 10\): \(1 + y + 2y = 10\), \(3y = 9\), \(y = 3\), \(x = 4\).</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">A rectangle has perimeter 26&nbsp;cm. The length is 4&nbsp;cm more than the width. Find the dimensions.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> width \(4.5\) cm, length \(8.5\) cm.</p>
      <p><strong>Steps:</strong> \(2\ell + 2w = 26\), \(\ell = w + 4\). Substitute: \(2(w+4)+2w=26\), \(4w+8=26\), \(w=4.5\), \(\ell=8.5\).</p>
    </div>
  </details>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li><em>The Nine Chapters on the Mathematical Art</em> — early elimination methods (fangcheng).</li>
    <li>al-Khwarizmi, <em>Al-Kitāb al-mukhtaṣar fī ḥisāb al-jabr wal-muqābala</em> (c. 820 CE).</li>
    <li>René Descartes, <em>La Géométrie</em> (1637) — coordinates and curves.</li>
    <li>HKDSE Compulsory Part curriculum — Number and Algebra strand (equations in two unknowns).</li>
  </ul>
</div>
