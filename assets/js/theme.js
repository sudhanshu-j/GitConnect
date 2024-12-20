"use strict"; 
// Enforces strict mode, which helps to catch common coding mistakes, such as creating undeclared variables,
// and it prevents the use of potentially problematic features like "with" or assigning to read-only properties.

const /** { NodeElement } */ $HTML = document.documentElement; 
// Selects the root <html> element of the document (the entire HTML document), and assigns it to the variable $HTML.
// This is the element where the theme (light/dark) will be applied by manipulating the data-theme attribute.

const /** { Boolean } */ isDark = window.matchMedia(
    "(prefers-color-scheme)" // Checks the system's theme preference, whether it's dark or light.
// If the system preference for color scheme is dark, `isDark` will be true, otherwise false.
  ).matches; // This evaluates to true if the user prefers a dark theme based on their OS or browser settings, otherwise false.

if (sessionStorage.getItem("theme")) {
  // Checks if there is a saved theme preference in the sessionStorage. sessionStorage persists only for the current page session.
  // If there is a stored theme value (either "dark" or "light"), it will use that to set the theme.

  $HTML.dataset.theme = sessionStorage.getItem("theme"); 
  // If a theme is found in sessionStorage, it sets the data-theme attribute on the <html> element.
  // This will apply the stored theme (either "dark" or "light") to the webpage.
} else {
  // If there is no theme stored in sessionStorage (e.g., the user has not previously selected a theme during the session)...

  $HTML.dataset.theme = isDark ? "dark" : "light"; 
  // Sets the theme based on the user's system preference for color scheme. If the system prefers dark mode, 
  // the theme is set to "dark", otherwise it is set to "light".
}

let /** { Boolean } */ isPressed = false; 
// A flag to track whether the theme toggle button is currently pressed (active state).
// This is used to indicate whether the button is in its "on" or "off" state, and toggle between light and dark themes.

const changeTheme = function () {
  // Function that is called when the user clicks on the theme toggle button. It switches between dark and light themes.

  isPressed = isPressed ? false : true; 
  // This toggles the value of the isPressed variable: if it is true, set it to false, otherwise set it to true.
  // This keeps track of whether the theme button is "pressed" (active) or "not pressed" (inactive).

  this.setAttribute("aria-pressed", isPressed); 
  // Updates the aria-pressed attribute on the button element to reflect whether it is currently pressed.
  // This improves accessibility for screen readers, indicating if the button is in an active or inactive state.

  $HTML.setAttribute(
    "data-theme", 
    $HTML.dataset.theme === "light" ? "dark" : "light" 
  );
  // Switches the theme of the document by changing the "data-theme" attribute on the <html> element.
  // If the current theme is light, it switches to dark, and if it's dark, it switches to light.

  sessionStorage.setItem("theme", $HTML.dataset.theme); 
  // Saves the current theme ("dark" or "light") to sessionStorage.
  // This ensures that the theme persists across page reloads during the same session.
};

window.addEventListener("load", function () {
  // Waits until the page is fully loaded (all resources, such as images, styles, and scripts, are loaded).
  // This ensures that the DOM is completely available before attempting to access elements like the button.

  const /** { NodeElement } */ $themeBtn =
      this.document.querySelector("[data-theme-btn]"); 
  // Finds the button element that will toggle the theme. It looks for an element with the attribute `data-theme-btn`.
  // This button will be used by the user to toggle between light and dark themes.

  $themeBtn.addEventListener("click", changeTheme); 
  // Adds an event listener for the 'click' event on the theme button ($themeBtn).
  // When the user clicks the button, it triggers the `changeTheme` function to toggle the theme.
});
