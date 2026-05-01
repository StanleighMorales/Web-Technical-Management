export const truncateRemarks = (remarks: string) => {
  const remarks_length = 10;

  const displayText = remarks.length > remarks_length ? remarks.substring(0, remarks_length) + "..." : remarks;

  return displayText;
}
