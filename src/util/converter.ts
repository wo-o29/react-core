export const camelCaseToSnakeCase = (str: string) => {
  return [...str]
    .map((char, i) => {
      if (i === 0 || char === char.toLowerCase()) {
        return char;
      }

      return "-" + char.toLowerCase();
    })
    .join("");
};
