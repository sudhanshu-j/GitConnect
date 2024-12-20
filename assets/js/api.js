"use strict"; // Enforces strict mode to catch potential errors and improve performance

/**
 * Fetch Data From Server
 *
 * @param {*} url API URL
 * @param {*} successCallback  Callback function to handle successful responses
 * @param {*} errorCallback  Callback function to handle error responses
 */

export async function fetchData(url, successCallback, errorCallback) {
  // Defines an asynchronous function named fetchData that takes three arguments:
  // - url: The API URL to fetch data from
  // - successCallback: A callback function that will be called on successful data retrieval
  // - errorCallback: A callback function that will be called if there is an error

  const response = await fetch(url); // Sends an HTTP request to the provided URL and waits for the response asynchronously.

  // 'fetch' returns a Promise that resolves to the Response object.
  // The 'await' keyword ensures that the code execution pauses until the response is received.

  if (response.ok) {
    // Checks if the HTTP response status is "OK" (status code 200–299).
    // The 'ok' property of the Response object is true for status codes between 200 and 299.

    const data = await response.json(); // Parses the response body as JSON asynchronously.
    // The 'await' ensures that the function waits until the JSON parsing is complete.

    successCallback(data); // Calls the successCallback function and passes the parsed data as an argument.
    // This function will handle the data returned from the API on success.
  } else {
    // If the response is not OK (status code is outside the 200-299 range), it enters the else block.

    const error = await response.json(); // Parses the error response body as JSON.
    // This is expected when the server sends a failure response with a JSON error message.

    errorCallback && errorCallback(error); // Checks if the errorCallback function is provided and calls it with the parsed error.
    // If errorCallback exists (not undefined), it is invoked with the error object as an argument.
  }
}
