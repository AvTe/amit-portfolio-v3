/**
 * The recognisable names, directly under the hero.
 *
 * These are the fastest credibility on the page, so they sit above the fold
 * rather than three cards down. Set as text, not logos — using client marks
 * for agency work you contributed to would overstate the relationship.
 *
 * "Agency" stays in the lead label on purpose. Without it the row reads as a
 * direct client list, which is a stronger claim than the work supports. It
 * carries the attribution that used to sit in a trailing tag, so the row is one
 * clean line instead of two labels bracketing the names.
 */
export function BrandRow() {
  return (
    <div className="brands">
      <p className="label">Agency storefronts for</p>
      {["Allbirds", "Everlane", "Filson"].map((brand) => (
        <span key={brand} className="brands__name">
          {brand}
        </span>
      ))}
    </div>
  );
}
