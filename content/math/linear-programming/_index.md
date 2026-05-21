+++
title = "Linear programming"
description = "Graph linear inequalities, identify feasible regions, and optimise objective functions in two variables."
template = "chapter.html"
weight = 19
[extra]
subject = "math"
chapter_id = "linear-programming"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    Linear programming finds the best value (maximum or minimum) of a linear objective under linear
    constraints. In high school, we solve two-variable problems graphically.
  </p>

  <h2 id="core-idea" class="book-prose__heading">Core idea</h2>
  <p>
    Optimize an objective like
    \[
    P=ax+by
    \]
    subject to inequalities such as \(x+y\le 12\), \(x\ge0\), \(y\ge0\).
  </p>

  <h2 id="modeling" class="book-prose__heading">Modeling from context</h2>
  <p>
    Typical setup:
  </p>
  <ol>
    <li>Define variables (\(x,y\)).</li>
    <li>Write constraints from limits/resources.</li>
    <li>Write objective function (profit, cost, time, etc.).</li>
    <li>Graph constraints and find feasible region.</li>
  </ol>

  <h2 id="graphing-constraints" class="book-prose__heading">Graphing constraints</h2>
  <p>
    For each inequality:
  </p>
  <ul>
    <li>Draw boundary line (use solid line for \(\le,\ge\); dashed for \(<,>\)).</li>
    <li>Test a point (often origin) to choose correct side.</li>
    <li>Combine all valid half-planes.</li>
  </ul>
  <p>
    Include non-negativity constraints \(x\ge0,y\ge0\) unless problem states otherwise.
  </p>

  <h2 id="feasible-region" class="book-prose__heading">Feasible region</h2>
  <p>
    The feasible region is where all constraints hold at once. In school-level cases, it is usually a
    polygon (possibly unbounded).
  </p>

  <h2 id="corner-point-principle" class="book-prose__heading">Corner-point principle</h2>
  <p>
    If an optimum exists for a bounded feasible region, it occurs at a vertex (corner point).
  </p>
  <p>
    So compute all feasible vertices, then evaluate objective at each.
  </p>

  <h2 id="worked-example" class="book-prose__heading">Worked example</h2>
  <p>
    Maximize \(P=3x+2y\) subject to:
  </p>
  <p class="book-formula">\[
    x+y\le 8,\quad x+3y\le 12,\quad x\ge0,\ y\ge0.
  \]</p>
  <p>
    Vertices are \((0,0)\), \((8,0)\), \((0,4)\), and intersection of
    \(x+y=8\) with \(x+3y=12\), which is \((6,2)\).
  </p>
  <p>
    Evaluate:
  </p>
  <ul>
    <li>\((0,0)\Rightarrow P=0\)</li>
    <li>\((8,0)\Rightarrow P=24\)</li>
    <li>\((0,4)\Rightarrow P=8\)</li>
    <li>\((6,2)\Rightarrow P=22\)</li>
  </ul>
  <p>
    Maximum is \(24\) at \((8,0)\).
  </p>

  <h2 id="special-cases" class="book-prose__heading">Special cases</h2>
  <ul>
    <li><strong>No feasible region:</strong> constraints are inconsistent.</li>
    <li><strong>Unbounded region:</strong> objective may have no maximum/minimum.</li>
    <li><strong>Multiple optima:</strong> objective line parallel to a feasible edge.</li>
  </ul>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Label all boundary lines and intercepts clearly.</li>
    <li>Show shading logic for each inequality.</li>
    <li>List vertex coordinates before evaluating objective.</li>
    <li>Give final answer with units and variable interpretation.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Linear programming developed in the 20th century for resource allocation and planning. George
    Dantzig's simplex method made large optimization problems practical in economics and operations
    research.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation and reasoning</h2>
  <h3 id="why-corners" class="book-prose__heading">Why corner points matter</h3>
  <p>
    Objective lines \(ax+by=c\) are parallel for different \(c\). Sliding this line across a polygonal
    feasible region reaches the last contact at a vertex (or an entire edge in tie cases).
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">
      Plot \(x+y\le6,\ x\ge0,\ y\ge0\). List feasible vertices.
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Vertices: \((0,0)\), \((6,0)\), \((0,6)\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      Maximize \(P=2x+y\) on vertices \((0,0)\), \((4,0)\), \((1,3)\), \((0,3)\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Values \(0,8,5,3\). Maximum \(8\) at \((4,0)\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      Minimize \(C=5x+3y\) with feasible vertices \((0,2)\), \((2,1)\), \((3,4)\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(C=6,13,27\). Minimum \(6\) at \((0,2)\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      In a model, why are \(x\ge0,\ y\ge0\) often included?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Quantities like items, time, or material cannot be negative.</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">
      How can you detect possible multiple optimal solutions graphically?
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Objective line is parallel to a boundary edge where both edge endpoints give the same optimum value.</p>
    </div>
  </details>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <ul>
    <li><strong>Production planning:</strong> maximize profit under labor and material limits.</li>
    <li><strong>Transport/logistics:</strong> minimize cost with capacity constraints.</li>
    <li><strong>Scheduling:</strong> optimize time allocation under availability rules.</li>
  </ul>

  <h2 id="references" class="book-prose__heading">References</h2>
  <ul>
    <li>Standard high-school extension units on graphical linear programming.</li>
    <li>Introductory operations research texts on feasible regions and corner-point optimization.</li>
  </ul>
</div>
