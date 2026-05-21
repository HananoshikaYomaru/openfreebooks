+++
title = "Basic probability"
description = "Calculate theoretical and experimental probabilities for simple events and complements."
template = "chapter.html"
weight = 32
[extra]
subject = "math"
chapter_id = "basic-probability"
strand = "Data Handling"
+++

<div class="book-prose">
  <p>
    Probability measures how likely an event is, from 0 (impossible) to 1 (certain).
  </p>

  <h2 id="fundamentals" class="book-prose__heading">Fundamentals</h2>
  <p class="book-formula">\[
    P(E)=\frac{\text{number of favorable outcomes}}{\text{number of equally likely outcomes}}.
  \]</p>
  <p>
    Also: \(0\le P(E)\le1\).
  </p>

  <h2 id="complement" class="book-prose__heading">Complement rule</h2>
  <p class="book-formula">\[
    P(E')=1-P(E).
  \]</p>

  <h2 id="multiple-events" class="book-prose__heading">Combined events</h2>
  <ul>
    <li>\(P(A\cup B)=P(A)+P(B)-P(A\cap B)\)</li>
    <li>If independent: \(P(A\cap B)=P(A)P(B)\)</li>
  </ul>

  <h2 id="experimental" class="book-prose__heading">Experimental probability</h2>
  <p class="book-formula">\[
    P(E)\approx\frac{\text{observed frequency}}{\text{number of trials}}.
  \]</p>

  <h2 id="sample-space" class="book-prose__heading">Sample spaces and trees</h2>
  <p>
    Use sample-space tables or tree diagrams for multi-step outcomes.
    Multiply along branches, add across valid branches.
  </p>

  <h2 id="exam-strategy" class="book-prose__heading">Exam strategy</h2>
  <ul>
    <li>Define event clearly before calculating.</li>
    <li>Use fractions first; round at end if needed.</li>
    <li>Check complement and total probability sanity.</li>
    <li>Use diagrams to avoid missing outcomes.</li>
  </ul>
</div>

<div class="book-prose">
  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <details class="book-question">
    <summary class="book-question__prompt">A fair die is rolled. Find \(P(\text{prime})\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{3}{6}=\frac12\) (2,3,5).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">A bag has 4 red and 6 blue balls. Find \(P(\text{not red})\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{6}{10}=\frac35\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">For independent events, \(P(A)=0.3,P(B)=0.4\). Find \(P(A\cap B)\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(0.12\).</p>
    </div>
  </details>
  <details class="book-question">
    <summary class="book-question__prompt">An event occurs 18 times in 50 trials. Estimate probability.</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(\frac{18}{50}=0.36\).</p>
    </div>
  </details>
</div>
