export const extractDate = (datetime: string) => {
  const [date] = datetime.split("T");
  return date;
};

export const extractTime = (datetime: string) => {
  const [, time] = datetime.split("T");
  return time.substring(0, 8);
};

export const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${year}-${month.padStart(2, "0")}-${date} ${hours}:${minutes}`;
};
