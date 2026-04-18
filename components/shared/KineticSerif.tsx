/**
 * KineticSerif
 * ------------------------------------------------------------------
 * Oversize serif word with a mirrored, masked "water reflection" echo
 * below — matches the kinetic serif headlines in the ancient-india
 * reference frames (f_10.jpg).
 */

interface KineticSerifProps {
  children: string;
  className?: string;
}

export function KineticSerif({ children, className }: KineticSerifProps) {
  return (
    <div className={`ai-kinetic-serif relative ${className ?? ''}`}>
      <span className="block">{children}</span>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 block origin-top scale-y-[-1] opacity-30 [mask-image:linear-gradient(to_top,white,transparent_55%)]"
      >
        {children}
      </span>
    </div>
  );
}
