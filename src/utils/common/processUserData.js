export const getTitleCase = (str) => {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const getfirstName = (name) => {
  const splitted = name?.split(" ") || [];
  return splitted.length > 0 ? splitted[0] : "User";
};
export const getuserNameChars = (name) => {
  const splitted = name?.split(" ") || [];
  return splitted.length > 0
    ? splitted.length === 1
      ? splitted[0][0]
      : (
          splitted[0][0] + (splitted[splitted.length - 1][0] || "")
        ).toUpperCase()
    : "U";
};
