export const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${year}-${month.padStart(2, "0")}-${date} ${hours}:${minutes}`;
};
