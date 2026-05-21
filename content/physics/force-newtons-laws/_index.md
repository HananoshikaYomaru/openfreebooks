+++
title = "Force and Newton's laws"
description = "Use free-body diagrams, F = ma, and motion graphs to predict how objects move."
template = "chapter.html"
weight = 1
[extra]
subject = "physics"
chapter_id = "force-newtons-laws"
strand = "Force and Motion"
+++

<div class="book-prose">
  <p>
    In HKDSE Physics, force and motion are linked by three core ideas:
    <span class="physics-key-term">inertia</span>,
    <span class="physics-key-term">net force</span>, and
    <span class="physics-key-term">acceleration</span>. This chapter gives you one practical flow:
    draw forces, find the net force, then predict acceleration with Newton's second law.
  </p>

  <h2 id="newtons-laws" class="book-prose__heading">Newton's three laws</h2>
  <ol>
    <li>
      <strong>First law:</strong> if net force is zero, velocity stays constant (including rest).
    </li>
    <li>
      <strong>Second law:</strong> acceleration is proportional to net force and inversely proportional
      to mass.
    </li>
    <li>
      <strong>Third law:</strong> forces come in equal and opposite interaction pairs.
    </li>
  </ol>

  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Core equation</p>
    <p class="book-formula">\[ \vec{F}_{\text{net}} = m\vec{a} \]</p>
  </div>

  <h2 id="workflow" class="book-prose__heading">Problem-solving workflow</h2>
  <ol>
    <li>Choose one object as your system.</li>
    <li>Sketch all external forces in a free-body diagram.</li>
    <li>Resolve forces by direction and compute net force.</li>
    <li>Use \(a = F_{\text{net}} / m\), then connect to motion equations.</li>
  </ol>

  <h2 id="interactive-force-lab" class="book-prose__heading">Interactive force lab</h2>
  <p>
    Adjust mass, pulling force, and surface friction. The demo computes friction, net force,
    acceleration, and the motion state for a 3-second interval from rest.
  </p>
</div>

<div class="physics-widget-mount" data-widget="force-lab" data-pagefind-ignore></div>

<div class="book-prose">
  <h2 id="interactive-motion-lab" class="book-prose__heading">Interactive motion graphs</h2>
  <p>
    Change initial velocity, acceleration, and elapsed time to inspect
    <span class="physics-key-term">v-t</span> and <span class="physics-key-term">s-t</span> behavior.
    This connects Newton's second law to kinematics directly.
  </p>
</div>

<div class="physics-widget-mount" data-widget="motion-lab" data-pagefind-ignore></div>

<div class="book-prose">
  <h2 id="examples" class="book-prose__heading">Worked checkpoints</h2>
  <p>
    These quick prompts are designed for class discussion or self-check before moving to momentum
    and energy.
  </p>

  <details class="book-question">
    <summary class="book-question__prompt">
      A 4 kg trolley is pulled right with 18 N while friction is 10 N left. What is its acceleration?
    </summary>
    <div class="book-question__solution">
      <p>
        Net force \(= 18 - 10 = 8\text{ N}\) to the right, so
        \(a = F_{\text{net}}/m = 8/4 = 2\text{ m s}^{-2}\) to the right.
      </p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      Why can a book stay at rest on a table even though gravity is acting?
    </summary>
    <div class="book-question__solution">
      <p>
        Gravity pulls down, but the table exerts an equal normal force upward. Net force is zero, so
        acceleration is zero.
      </p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      A rocket pushes exhaust gas backward. Which Newton's law explains forward thrust?
    </summary>
    <div class="book-question__solution">
      <p>
        Newton's third law. The rocket pushes gas backward; the gas pushes the rocket forward with an
        equal and opposite force.
      </p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      In the motion lab, what happens to the velocity-time line when acceleration is set to zero?
    </summary>
    <div class="book-question__solution">
      <p>
        The line becomes horizontal, showing constant velocity. Position then changes linearly with
        time.
      </p>
    </div>
  </details>
</div>
