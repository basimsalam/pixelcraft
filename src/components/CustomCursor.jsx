export function CustomCursor({ hovered, position }) {
  const cursorClassName = `cursor ${hovered ? "hovered" : ""}`;
  const ringClassName = `cursor-ring ${hovered ? "hovered" : ""}`;

  return (
    <>
      <div className={cursorClassName} style={{ left: position.x, top: position.y }} />
      <div className={ringClassName} style={{ left: position.x, top: position.y }} />
    </>
  );
}
