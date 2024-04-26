export function getCookie(cookies, name) {
  let cookieValue = null;
  if (cookies && cookies !== "") {
    const cookiesArray = cookies.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
      const cookie = cookiesArray[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
