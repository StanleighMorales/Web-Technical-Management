export const SlugCondition = (condition: string) => {
  if (!condition) return;
  if (condition === "New") return "bg-green-100 text-green-700";
  if (condition === "Good") return "bg-yellow-100 text-yellow-700";
  if (condition === "Defective") return "bg-blue-100 text-blue-700";
  if (condition === "Refurbished") return "bg-gray-100 text-gray-700";
  if (condition === "NeedRepair") return "bg-red-100 text-red-700";
  return condition;
};
