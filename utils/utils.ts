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

export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${paddedMinutes} ${ampm}`;
};

export const truncateStr = (title: string, maxLength: number = 10): string => {
  if (!title) return "";
  return title.length > maxLength
    ? title.substring(0, maxLength) + "..."
    : title;
};

export const formatTimeInput = (input: string): string => {
  const digitsOnly = input.replace(/[^0-9]/g, "");
  const limited = digitsOnly.slice(0, 4);

  if (limited.length >= 3) {
    let hours = constraintHoursTo12(limited.slice(0, 2));
    let minutes = limited.slice(2);

    if (minutes.length >= 2) {
      let mins = parseInt(minutes, 10);
      if (mins > 59) mins = 59;
      minutes = mins.toString().padStart(2, "0");
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

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

export const formatMillisecondsToTime = (milliseconds: number): string => {
  if (!milliseconds || milliseconds === 0) return "0:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatDisplayNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 10000) {
    return (num / 1000).toFixed(0) + "K";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
