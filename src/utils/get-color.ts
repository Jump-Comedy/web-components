export default function getColor(colors, name) {
  const color = colors.find((c) => c.property === name);
  return color ? color.value : "#000000";
}
