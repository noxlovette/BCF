// src/routes/DjangoAPI.ts

let csrfToken = '';


export async function fetchCSRFToken() {
  const response = await fetch("http://localhost:8000/api/get-csrf/", {
      method: 'GET',
      credentials: 'include'  // Necessary to include cookies if they are accessible
  });
  const data = await response.json();
  console.log(data.csrfToken);
  return data.csrfToken;  // Use this token for subsequent POST, PUT, DELETE requests
  
}


// Function to fetch data from Django API
export async function fetchDataFromDjango(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
  credentials: RequestCredentials = "include"  // Set to include to ensure cookies are sent
): Promise<any> {
  // Ensure CSRF token is set
  if (!csrfToken) {
    csrfToken = await fetchCSRFToken();
  }

  // Construct headers with CSRF token included
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  // Make a request to Django API with CSRF token included in headers
  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials,
  };

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    let errorText = await response.json();
    throw new Error(errorText.error);
  }

  // Only parse as JSON if the response has content
  if (response.status !== 204 && response.statusText !== "No Content") {
    const data = await response.json();
    return data;
  }
}

