const MARQUEE_TEXT =
  "Every human being deserves free high quality learning materials — Man Lung Yeung";

export function Marquee() {
  const segment = () => (
    <span class="marquee-text">
      {MARQUEE_TEXT}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  );

  return (
    <div class="marquee-shell" role="region" aria-label="Site quote">
      <div class="marquee-line" />
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          {segment()}
          {segment()}
          {segment()}
        </div>
      </div>
      <div class="marquee-line" />
    </div>
  );
}
