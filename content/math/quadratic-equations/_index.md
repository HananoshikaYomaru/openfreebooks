+++
title = "Quadratic equations"
description = "The discriminant, nature of roots, and the graph of y = ax² + bx + c."
template = "chapter.html"
weight = 2
[extra]
subject = "math"
chapter_id = "quadratic-equations"
strand = "Number & Algebra"
+++

<div class="book-prose">
  <p>
    A quadratic equation in one unknown has the form \(ax^2 + bx + c = 0\), where
    \(a \neq 0\). You can solve these by factorisation, the quadratic
    formula, or by reading information from the graph of \(y = ax^2 + bx + c\).
  </p>

  <h2 id="discriminant" class="book-prose__heading">The discriminant</h2>
  <p>
    The <strong>discriminant</strong> \(\Delta\) (delta) is defined below. It tells you how many
    <em>real</em> roots the equation has without fully solving it.
  </p>

  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Definition</p>
    <p class="book-formula">\[ \Delta = b^2 - 4ac \]</p>
  </div>

  <h2 id="nature-of-roots" class="book-prose__heading">Nature of roots</h2>
  <div class="book-table-wrap">
    <table class="book-table">
      <thead>
        <tr>
          <th scope="col">Discriminant</th>
          <th scope="col">Nature of roots</th>
          <th scope="col">Graph of \(y = ax^2 + bx + c\)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>\(\Delta &gt; 0\)</td>
          <td>Two distinct real roots</td>
          <td>Parabola cuts the x-axis twice</td>
        </tr>
        <tr>
          <td>\(\Delta = 0\)</td>
          <td>One repeated real root (equal roots)</td>
          <td>Vertex touches the x-axis</td>
        </tr>
        <tr>
          <td>\(\Delta &lt; 0\)</td>
          <td>No real roots</td>
          <td>Parabola lies entirely above or below the x-axis</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    When \(\Delta \geq 0\), the quadratic formula gives the roots:
    \[ x = \frac{-b \pm \sqrt{\Delta}}{2a} \]
  </p>

  <h2 id="try-it-yourself" class="book-prose__heading">Try it yourself</h2>
  <p>
    Use the explorer below to change \(a\), \(b\), and \(c\). Watch how \(\Delta\) and the
    parabola change, and read off the nature of the roots.
  </p>
</div>

<div class="math-widget-mount" data-widget="explorer" data-pagefind-ignore></div>

<div class="book-prose">
  <h2 id="history" class="book-prose__heading">History</h2>
  <p>
    People have worked on problems that lead to quadratic equations for thousands of years.
    Babylonian clay tablets from around 1800&nbsp;BCE record area and length puzzles — for example,
    finding the sides of a rectangle when you know its area and perimeter. Those situations
    produce equations in one unknown whose highest power is two.
  </p>

  <figure class="book-figure">
    <img
      class="book-figure__img"
      src="/chapters/math/quadratic-equations/babylonian-quadratic-tablet.png"
      alt="Babylonian clay tablet with cuneiform text recording a quadratic area problem"
      width="960"
      height="640"
      loading="lazy"
      decoding="async"
    />
    <figcaption class="book-figure__caption">
      A Babylonian clay tablet (about 1800&nbsp;BCE) with a problem equivalent to finding the
      sides of a rectangle from its area and perimeter.
    </figcaption>
  </figure>

  <p>
    Early methods were often geometric: you imagine completing a rectangle to make a square,
    which is the same idea behind <em>completing the square</em> today. In the 9th century,
    <strong>al-Khwarizmi</strong> wrote systematic rules for many types of quadratic problems,
    sorted by which coefficients were present. He did not use modern symbols like \(x^2\), but
    the logic matches what we still teach.
  </p>
  <p>
    During the Renaissance, mathematicians such as <strong>Cardano</strong> and
    <strong>Tartaglia</strong> pushed further into solving cubics and quartics. Along the way they
    met equations whose discriminants were negative — no real roots, yet the algebra still
    demanded answers. That tension helped open the door to <strong>complex numbers</strong>, a
    topic you will meet in a later chapter.
  </p>

  <h2 id="derivation" class="book-prose__heading">Derivation</h2>
  <p>
    The quadratic formula comes from rearranging \(ax^2 + bx + c = 0\) and completing the square.
    Below is a guided derivation; routine algebra between steps is left for you to check.
  </p>
  <p>
    Start with \(a \neq 0\) and divide every term by \(a\):
    \[ x^2 + \frac{b}{a}x + \frac{c}{a} = 0. \]
    Move the constant to the right:
    \[ x^2 + \frac{b}{a}x = -\frac{c}{a}. \]
  </p>
  <p>
    The expression \(x^2 + \frac{b}{a}x\) is almost a perfect square. Add and subtract
    \(\left(\frac{b}{2a}\right)^2\) on the left (equivalently, add that square to both sides):
    \[ x^2 + \frac{b}{a}x + \left(\frac{b}{2a}\right)^2 = -\frac{c}{a} + \left(\frac{b}{2a}\right)^2. \]
    The left side factors as a square:
    \[ \left(x + \frac{b}{2a}\right)^2 = \frac{b^2 - 4ac}{4a^2}. \]
  </p>
  <p>
    Take square roots (when the right-hand side is non-negative you get real solutions):
    \[ x + \frac{b}{2a} = \pm \frac{\sqrt{b^2 - 4ac}}{2a}. \]
    Solve for \(x\):
  </p>
  <div class="book-callout book-callout--formula" role="note">
    <p class="book-callout__label">Quadratic formula</p>
    <p class="book-formula">
      \[ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \]
    </p>
  </div>
  <p>
    The quantity under the square root is exactly the discriminant:
    \(\Delta = b^2 - 4ac\). So the formula is \(x = \frac{-b \pm \sqrt{\Delta}}{2a}\) whenever
    \(\Delta \geq 0\). If \(\Delta &gt; 0\) you get two distinct real roots; if \(\Delta = 0\) the
    \(\pm\) gives the same root twice; if \(\Delta &lt; 0\) there is no real square root and the
    equation has no real solutions — matching the nature-of-roots table above.
  </p>

  <h2 id="checkpoints" class="book-prose__heading">Checkpoints</h2>
  <p>
    Pause and think before moving on. There are no answers on this page — discuss with a
    classmate or write your reasoning in a notebook.
  </p>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      In the explorer, keep \(a\) and \(b\) fixed and slowly change \(c\) so that \(\Delta\) goes
      from positive to zero. What happens to the two x-intercepts on the graph?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Can \(ax^2 + bx + c = 0\) with \(a \neq 0\) have three distinct real solutions? Why or why not?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      Suppose \(a &gt; 0\) and \(\Delta &lt; 0\). Where does the entire parabola \(y = ax^2 + bx + c\)
      sit relative to the x-axis?
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      A ball is thrown straight upward from ground level. Without using numbers, describe a
      situation where \(\Delta &gt; 0\) for height versus time, and another where \(\Delta = 0\).
    </p>
  </div>

  <div class="book-callout" role="note">
    <p class="book-callout__label">Checkpoint</p>
    <p>
      After completing the square you had \(\left(x + \frac{b}{2a}\right)^2 = \frac{\Delta}{4a^2}\).
      Why must the sign of \(\Delta\) match whether the parabola crosses the x-axis?
    </p>
  </div>

  <h2 id="applications" class="book-prose__heading">Applications</h2>

  <h3 id="projectile-motion" class="book-prose__heading">Projectile motion</h3>
  <p>
    Near Earth’s surface, height \(h\) (in metres) of an object thrown upward often follows
    \[ h = -\tfrac{1}{2}gt^2 + v_0 t + h_0, \]
    where \(t\) is time in seconds, \(g \approx 9.8\) is gravitational acceleration,
    \(v_0\) is initial upward speed, and \(h_0\) is starting height. This is a quadratic in
    \(t\). Setting \(h = 0\) asks when the object is at ground level; the solutions are the
    landing times. The discriminant tells you whether there are two crossing times
    (\(\Delta &gt; 0\)), one (\(\Delta = 0\)), or none (\(\Delta &lt; 0\)) — for example if the
    model never reaches the ground in the time you care about.
  </p>

  <div class="math-widget-mount" data-widget="projectile-demo" data-pagefind-ignore></div>

  <h3 id="profit-pricing" class="book-prose__heading">Profit and pricing</h3>
  <p>
    A shop might find that when it charges \(p\) dollars per item, revenue is \(p\) times
    quantity sold, while cost has a fixed part plus a cost per item. Profit (revenue minus cost)
    is often a quadratic in \(p\) that opens downward — there is a best price at the vertex.
    For example, with profit \(\Pi\) in dollars,
    \[ \Pi(p) = -2p^2 + 40p - 150. \]
    Setting \(\Pi = 0\) asks for <em>break-even</em> prices; \(\Delta\) tells you whether two
    break-even prices exist, one, or none.
  </p>

  <div class="math-widget-mount" data-widget="profit-demo" data-pagefind-ignore></div>

  <h3 id="area-fixed-perimeter" class="book-prose__heading">Area with fixed perimeter</h3>
  <p>
    A rectangle with perimeter \(P\) can be described by width \(x\) and length
    \(\frac{P}{2} - x\). Its area is
    \[ A(x) = x\left(\frac{P}{2} - x\right) = -\!x^2 + \frac{P}{2}x, \]
    a downward-opening parabola. The largest area occurs at the vertex, not at the extremes
    \(x = 0\) or \(x = \frac{P}{2}\) (which give zero area).
  </p>

  <div class="math-widget-mount" data-widget="area-demo" data-pagefind-ignore></div>
</div>
