// Generate a consistent color based on expense type
const getExpenseColor = (expenseType) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
  ];
  let hash = 0;
  for (let i = 0; i < expenseType.length; i++) {
    hash = expenseType.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
export { getExpenseColor };
