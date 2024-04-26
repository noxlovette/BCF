// src/routes/DjangoAPI.ts

// Function to fetch CSRF token from Django
export async function fetchCSRFToken() {
  const response = await fetch("http://localhost:8000/api/get-csrf-token/");
  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token");
  }
  const data = await response.json();
  return data.csrfToken;
}

// Function to fetch data from Django API
export async function fetchDataFromDjango(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: any = null,
): Promise<any> {
  // function body
  const csrfToken = await fetchCSRFToken();

  // Construct headers with CSRF token included
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };

  // Make a request to Django API with CSRF token included in headers
  const options = {
    method,
    headers,
    // Include any other necessary options such as body for POST requests
    body: body ? JSON.stringify(body) : null,
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
