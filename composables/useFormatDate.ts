// type="long" =======>  "25 آبان 1403"
// type="time" =======>  "22:30"
// type="numeric" =======>  "12/11/1403"

export const useFormatDate = (date: string | Date, type?: string) => {
  let year = new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
  });
  let longMonth = new Date(date).toLocaleDateString("fa-IR", {
    month: "long",
  });
  let month = new Date(date).toLocaleDateString("fa-IR", {
    month: "numeric",
  });
  let day = new Date(date).toLocaleDateString("fa-IR", {
    day: "numeric",
  });
  let hour = new Date(date).getHours();
  let minute = new Date(date).getMinutes();

  return type === "time"
    ? `${hour}:${minute}`
    : type === "numeric"
    ? `${year}/${month}/${day}`
    : `${day} ${longMonth}  ${year} `;
};
