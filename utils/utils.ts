/**
 * Extracts and formats the date only from a noti date object.
 * @param date The Date object from the notification.
 * @returns A formatted date string (e.g., '25 Oct 2025').
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const year = date.getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[date.getMonth()];

  return `${day} ${monthName} ${year}`;
};

/**
 * Extracts and formats the time only from a noti date object.
 * @param date The Date object from the notification.
 * @returns A formatted time string in 12-hour format (e.g., '2:00 PM').
 */
export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  // The hour '0' should be '12'
  hours = hours ? hours : 12;

  // Pad minutes with a leading zero if necessary
  const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${paddedMinutes} ${ampm}`;
};

/**
 * Truncates a string to a maximum length and appends '...' if it was truncated.
 * @param title The string to truncate.
 * @param maxLength The maximum length of the string before truncation (default is 10).
 * @returns The truncated string.
 */
export const truncateStr = (title: string, maxLength: number = 10): string => {
  if (!title) return "";
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
};

/**
 * Formats time input to HH:MM format with validation.
 * Hours limited to 00-12, Minutes limited to 00-59.
 * @param input The raw time input string.
 * @returns A formatted time string (e.g., '09:30').
 */
export const formatTimeInput = (input: string): string => {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/[^0-9]/g, "");

  // Limit to 4 digits (HHMM)
  const limited = digitsOnly.slice(0, 4);

  // Add colon after 2 digits
  if (limited.length >= 3) {
    let hours = parseInt(limited.slice(0, 2), 10);
    let minutes = limited.slice(2);

    // Constrain hours to 00-12
    hours = constraintHoursTo12(limited.slice(0, 2));

    // Constrain minutes to 00-59
    if (minutes.length >= 2) {
      let mins = parseInt(minutes, 10);
      if (mins > 59) {
        mins = 59;
      }
      minutes = mins.toString().padStart(2, "0");
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  // Handle partial hour input
  if (limited.length === 2) {
    const constrainedHours = constraintHoursTo12(limited);
    return `${constrainedHours.toString().padStart(2, "0")}:`;
  }

  return limited;
};

const constraintHoursTo12 = (hoursStr: string): number => {
  let hours = parseInt(hoursStr, 10);
  if (hours > 12) {
    let firstDigit = hoursStr.slice(0, 1);
    let secondDigit = hoursStr.slice(1, 2);
    if (secondDigit == "0") {
      hours = parseInt("0" + firstDigit);
    } else {
      hours = 12;
    }
  }
  return hours;
};
