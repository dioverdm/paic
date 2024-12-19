/**
 * BackgroundGrid component that renders a subtle grid pattern
 * Uses CSS grid and gradients to create a responsive background effect
 */
export function BackgroundGrid() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <div
        className="absolute h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(var(--foreground) / 0.075) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(var(--foreground) / 0.075) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(at center, white 60%, transparent 90%)",
        }}
      />
      <div
        className="absolute h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(var(--foreground) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(var(--foreground) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(at center, white 60%, transparent 90%)",
        }}
      />
    </div>
  );
}
