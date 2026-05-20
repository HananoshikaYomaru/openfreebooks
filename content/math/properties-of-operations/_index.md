+++
title = "Properties of operations"
description = "See why order, grouping, and distribution can change how you write a sum or product without changing the result — with interactive area and dot models."
template = "chapter.html"
weight = 2
[extra]
subject = "math"
chapter_id = "properties-of-operations"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    You can already read number sentences from <strong>basic math notation</strong> and combine
    numbers from <strong>counting and numbers</strong>. This chapter names three patterns that keep
    showing up: rules about <strong>order</strong>, <strong>grouping</strong>, and
    <strong>splitting a sum before you multiply</strong>. They do not replace careful arithmetic —
    they explain why different written forms can still mean the same amount.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Three properties</p>
    <ul>
      <li><strong>Commutative</strong> — swap the order (for + and ×).</li>
      <li><strong>Associative</strong> — regroup with brackets (for + and ×).</li>
      <li><strong>Distributive</strong> — multiply each part of a sum (× over +).</li>
    </ul>
  </div>

  <h2 id="compare-three" class="book-prose__heading">Same story, three rules</h2>
  <p>
    Imagine three friends. Friend A gets <strong>\$2</strong> each day for <strong>3</strong> days and
    <strong>\$2</strong> each day for <strong>5</strong> more days. You can count the money in
    different ways:
  </p>
  <div class="prop-example">
    <span class="prop-example__label">Distribute</span>
    \(2(3 + 5) = (2 \times 3) + (2 \times 5) = 6 + 10 = 16\)
  </div>
  <div class="prop-example">
    <span class="prop-example__label">Commute</span>
    \(3 + 5 = 5 + 3 = 8\) days in either order before you multiply by \$2 per day in a lump sum.
  </div>
  <div class="prop-example">
    <span class="prop-example__label">Associate</span>
    \((2 + 3) + 5 = 2 + (3 + 5) = 10\) when you group which daily amounts you add first.
  </div>
  <p>
    <strong>Distribute</strong> is about multiplying through a bracket.
    <strong>Commute</strong> is about order.
    <strong>Associate</strong> is about which pair you combine first when there are three or more
    numbers.
  </p>

  <h2 id="commutative" class="book-prose__heading">Commutative property</h2>
  <p>
    <strong>Commute</strong> means to move or swap. For <strong>addition</strong> and
    <strong>multiplication</strong> of whole numbers, changing the order does not change the result.
  </p>
  <div class="book-formula">
    \[ a + b = b + a \qquad ab = ba \]
  </div>
  <p>
    Example: \(3 + 5 = 5 + 3 = 8\). Three dots then five dots is the same total as five dots then
    three dots.
  </p>
  <p>
    <strong>Subtraction and division are not commutative.</strong> \(5 - 3 \neq 3 - 5\) and
    \(6 \div 2 \neq 2 \div 6\). Order matters there.
  </p>
  <div class="math-widget-mount" data-widget="commutative-demo" data-pagefind-ignore></div>

  <h2 id="associative" class="book-prose__heading">Associative property</h2>
  <p>
    When you add or multiply <strong>three or more</strong> numbers, brackets tell you which pair to
    do first. The <strong>associative</strong> property says different groupings give the same answer
    (for + and × only).
  </p>
  <div class="book-formula">
    \[ (a + b) + c = a + (b + c) \qquad (ab)c = a(bc) \]
  </div>
  <p>
    Example: \((2 + 3) + 5 = 5 + 5 = 10\) and \(2 + (3 + 5) = 2 + 8 = 10\). You may combine
    \(2 + 3\) first or \(3 + 5\) first.
  </p>
  <p>
    Again, <strong>subtraction and division are not associative.</strong> \((10 - 4) - 2 \neq
    10 - (4 - 2)\).
  </p>
  <div class="math-widget-mount" data-widget="associative-demo" data-pagefind-ignore></div>

  <h2 id="distributive" class="book-prose__heading">Distributive property</h2>
  <p>
    The <strong>distributive</strong> property links multiplication to addition. Multiplying a sum
    is the same as multiplying each addend and then adding — “distribute” the multiply across the
    bracket.
  </p>
  <div class="book-formula">
    \[ a(b + c) = ab + ac \]
  </div>
  <p>
    Example: \(2(3 + 5) = 2 \times 8 = 16\). Split the width into \(3\) and \(5\): \(2 \times 3 = 6\)
    and \(2 \times 5 = 10\), then \(6 + 10 = 16\). The area model below shows one tall rectangle
    split into two parts.
  </p>
  <p>
    Later, in <strong>written calculation</strong>, partial products in multiplication use this idea:
    you multiply by each digit of the bottom number separately, then add the rows.
  </p>
  <div class="math-widget-mount" data-widget="distributive-area-demo" data-pagefind-ignore></div>

  <h2 id="which-property" class="book-prose__heading">Which property is it?</h2>
  <div class="book-table-wrap">
    <table class="book-table">
      <thead>
        <tr>
          <th scope="col">You change…</th>
          <th scope="col">Property</th>
          <th scope="col">Example</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Order of two numbers</td>
          <td>Commutative</td>
          <td>\(4 + 7 = 7 + 4\)</td>
        </tr>
        <tr>
          <td>Brackets with three numbers</td>
          <td>Associative</td>
          <td>\((1 + 2) + 3 = 1 + (2 + 3)\)</td>
        </tr>
        <tr>
          <td>Multiply through a sum</td>
          <td>Distributive</td>
          <td>\(3(2 + 4) = 3 \times 2 + 3 \times 4\)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 id="next" class="book-prose__heading">What comes next</h2>
  <p>
    In <strong>written calculation</strong> you will stack digits and use carry and borrow. Knowing
    these properties helps you check work (e.g. swap order to verify an addition) and understand why
    multiplication splits into several rows before you add them.
  </p>
</div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    Long before algebra used letters, merchants and accountants rearranged piles and rows of goods.
    Indian and Islamic mathematicians in the Middle Ages wrote rules for how sums and products
    behave. The words <strong>commutative</strong>, <strong>associative</strong>, and
    <strong>distributive</strong> became standard in European algebra books in the 1800s, when
    school math settled on one notation for all.
  </p>
  <p>
    The distributive rule is ancient geometry in disguise: a large rectangle split into two smaller
    ones has total area equal to the sum of the parts. That picture is still one of the clearest
    explanations today.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <ol>
    <li>
      Which property lets you write \(7 + 4\) as \(4 + 7\) without changing the total?
    </li>
    <li>
      Is \((5 \times 2) \times 3\) the same as \(5 \times (2 \times 3)\)? Which property says so?
    </li>
    <li>
      Rewrite \(4(6 + 1)\) as a sum of two products.
    </li>
    <li>
      Why is \(8 - 3\) not commutative? Give two different answers for \(3 - 8\) and \(8 - 3\).
    </li>
    <li>
      A rectangle is 5 units tall and \((2 + 3)\) units wide. How does the distributive property
      describe its area?
    </li>
  </ol>

  <h2 id="applications" class="book-prose__heading">Applications</h2>
  <h3 id="mental-math" class="book-prose__heading">Mental math</h3>
  <p>
    Distribute to make friendly numbers: \(7 \times 98 = 7 \times (100 - 2) = 700 - 14 = 686\).
    Commute to add easier first: \(6 + 47 + 4 = (6 + 4) + 47 = 57\).
  </p>
  <h3 id="shopping" class="book-prose__heading">Shopping and sharing</h3>
  <p>
    Buying 3 packs of \((2 + 5)\) items is the same as \(3 \times 2\) items plus \(3 \times 5\)
    items. Swapping the order you scan barcodes does not change how many items you have (commute on
    addition when you merge carts).
  </p>
  <h3 id="algebra-later" class="book-prose__heading">Later algebra</h3>
  <p>
    Expanding \(a(b + c)\) in polynomials and factorising common factors both rely on the
    distributive property. You will meet them again in <strong>polynomials: expansion &amp;
    factorisation</strong>.
  </p>

  <h2 id="question-bank" class="book-prose__heading">Question bank</h2>

  <h3 id="questions-easy" class="book-prose__heading">Easy</h3>

  <details class="book-question">
    <summary class="book-question__prompt">
      Fill in the blank using a property: \(9 + 6 = 6 + \underline{\hspace{1.5em}}\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(9\) — commutative property of addition.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Compute: \(2(4 + 3)\).</summary>
    <div class="book-question__solution">
      <p>
        <strong>Answer:</strong> \(14\). Either \(2 \times 7 = 14\), or \(2 \times 4 + 2 \times 3 = 8 +
        6 = 14\) (distributive).
      </p>
    </div>
  </details>

  <h3 id="questions-intermediate" class="book-prose__heading">Intermediate</h3>

  <details class="book-question">
    <summary class="book-question__prompt">
      Evaluate both sides and compare: \((3 + 4) + 5\) and \(3 + (4 + 5)\).
    </summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> Both equal \(12\) — associative property of addition.</p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">Use distribution to find \(5 \times 102\).</summary>
    <div class="book-question__solution">
      <p><strong>Answer:</strong> \(510\). Steps: \(5 \times (100 + 2) = 500 + 10 = 510\).</p>
    </div>
  </details>

  <h3 id="questions-difficult" class="book-prose__heading">Difficult</h3>

  <details class="book-question">
    <summary class="book-question__prompt">
      Explain why \(12 \div (3 \div 2)\) is not the same as \((12 \div 3) \div 2\).
    </summary>
    <div class="book-question__solution">
      <p>
        <strong>Answer:</strong> Left: \(12 \div 1.5 = 8\). Right: \(4 \div 2 = 2\). Division is not
        associative; grouping changes the meaning.
      </p>
    </div>
  </details>

  <details class="book-question">
    <summary class="book-question__prompt">
      A garden bed is 4 m wide and \((2 + 3)\) m long. Write two ways to find its area and show they
      match.
    </summary>
    <div class="book-question__solution">
      <p>
        <strong>Answer:</strong> \(20\) m². One rectangle: \(4 \times 5 = 20\). Split length:
        \(4 \times 2 + 4 \times 3 = 8 + 12 = 20\) (distributive).
      </p>
    </div>
  </details>
</div>
