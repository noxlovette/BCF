export function getGreeting() {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return "morning ☕";
  } else if (hours >= 12 && hours < 18) {
    return "afternoon ☀️";
  } else if (hours >= 18 && hours < 22) {
    return "evening 🌖";
  } else {
    return "night 😴";
  }
}
