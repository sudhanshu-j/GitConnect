"use strict"; // Ensures the code is executed in strict mode, catching common coding mistakes.

import { fetchData } from "./api.js"; // Imports the `fetchData` function from the `api.js` file, used for making API calls.
import { numberToKilo } from "./module.js"; // Imports the `numberToKilo` function from the `module.js` file to format numbers (e.g., adding 'k' for large numbers).

/**
 * Add EventListener on Multiple elements
 *
 * @param {NodeList} $elements NodeList  // A NodeList representing the elements to which the event listener will be attached.
 * @param {string} eventType String  // The event type (e.g., "click", "keydown").
 * @param {Function} callback Callback function  // The function that will be called when the event is triggered.
 */
const addEventOnElements = function ($elements, eventType, callback) {
  // Iterates over each element in the NodeList and adds the event listener.
  for (const $item of $elements) {
    $item.addEventListener(eventType, callback); // Attaches the event listener to each element.
  }
};

// Header Scroll State
const /** { NodeElement } */ $header = document.querySelector("[data-header]"); // Selects the header element with the `data-header` attribute.

window.addEventListener("scroll", function () {
  // Adds an event listener to the window object for the scroll event.
  $header.classList[this.window.scrollY > 50 ? "add" : "remove"]("active"); // If the page is scrolled more than 50px, adds "active" class to the header. Otherwise, removes it.
});

// Search Toggle
const /** { NodeElement } */ $searchToggler = document.querySelector(
    "[data-search-toggler]"
  ); // Selects the search toggle button.
const /** { NodeElement } */ $searchField = document.querySelector(
    "[data-search-field]"
  ); // Selects the search input field.

let /** { Boolean } */ isExpanded = false; // Boolean variable to track whether the search field is expanded.

$searchToggler.addEventListener("click", function () {
  // Adds a click event listener to the search toggler button.
  $header.classList.toggle("search-active"); // Toggles the `search-active` class on the header, which likely shows the search field.
  isExpanded = isExpanded ? false : true; // Toggles the `isExpanded` state between `true` and `false`.
  this.setAttribute("aria-expanded", isExpanded); // Sets the `aria-expanded` attribute to indicate the state of the search field (for accessibility).
  $searchField.focus(); // Focuses on the search input field when the search button is clicked.
});

// Tab Navigation
const /** { NodeList } */ $tabBtns =
    document.querySelectorAll("[data-tab-btn]"); // Selects all tab buttons with the `data-tab-btn` attribute.
const /** { NodeList } */ $tabPanels =
    document.querySelectorAll("[data-tab-panel]"); // Selects all tab panels with the `data-tab-panel` attribute.

let /** { NodeElement } */ [$lastActiveTabBtn] = $tabBtns; // Initializes the last active tab button.
let /** { NodeElement } */ [$lastActiveTabPanel] = $tabPanels; // Initializes the last active tab panel.

addEventOnElements($tabBtns, "click", function () {
  // Adds a click event listener to each tab button.
  $lastActiveTabBtn.setAttribute("aria-selected", "false"); // Sets the `aria-selected` attribute of the last active tab button to `false`.
  $lastActiveTabPanel.setAttribute("hidden", ""); // Hides the last active tab panel by setting the `hidden` attribute.

  this.setAttribute("aria-selected", "true"); // Sets the `aria-selected` attribute of the clicked tab button to `true`.

  const /** { NodeElement } */ $currentTabPanel = document.querySelector(
      `#${this.getAttribute("aria-controls")}` // Selects the tab panel corresponding to the clicked tab button.
    );

  $currentTabPanel.removeAttribute("hidden"); // Removes the `hidden` attribute from the corresponding tab panel, making it visible.

  $lastActiveTabBtn = this; // Updates the reference to the last active tab button.
  $lastActiveTabPanel = $currentTabPanel; // Updates the reference to the last active tab panel.
});

// Keyboard accessibility for tab buttons
addEventOnElements($tabBtns, "keydown", function (e) {
  // Adds a keydown event listener to each tab button for keyboard navigation.
  const /** { NodeElement } */ $nextElement = this.nextElementSibling; // Selects the next tab button.
  const /** { NodeElement } */ $previousElement = this.previousElementSibling; // Selects the previous tab button.

  if (e.key === "ArrowRight" && $nextElement) {
    // If the right arrow key is pressed and there is a next tab button.
    this.setAttribute("tabindex", "-1"); // Removes focusability from the current tab button.
    $nextElement.setAttribute("tabindex", "0"); // Makes the next tab button focusable.
    $nextElement.focus(); // Focuses on the next tab button.
  } else if (e.key === "ArrowLeft" && $previousElement) {
    // If the left arrow key is pressed and there is a previous tab button.
    this.setAttribute("tabindex", "-1"); // Removes focusability from the current tab button.
    $previousElement.setAttribute("tabindex", "0"); // Makes the previous tab button focusable.
    $previousElement.focus(); // Focuses on the previous tab button.
  }
});

// Working with API

// Search
const /** { NodeElement } */ $searchSubmit = document.querySelector(
    "[data-search-submit]"
  ); // Selects the search submit button.

let /** { String } */ apiUrl = "https://api.github.com/users/sudhanshu-j"; // Default API URL to fetch data for a specific GitHub user.

let /** { String } */ repoUrl,
  followersUrl,
  followingUrl = ""; // Variables to hold the API URLs for repositories, followers, and following.

const searchUser = function () {
  if (!$searchField.value) return; // If the search field is empty, do nothing.

  apiUrl = `https://api.github.com/users/${$searchField.value}`; // Updates the API URL based on the search field value (GitHub username).

  updateProfile(apiUrl); // Calls the `updateProfile` function to fetch and display the profile data.
};

$searchSubmit.addEventListener("click", searchUser); // Adds a click event listener to the search submit button to initiate the search.

$searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchUser(); // Adds a keydown event listener to the search field to trigger the search when the "Enter" key is pressed.
});

// Profile
const /** { NodeElement } */ $profileCard = document.querySelector(
    "[data-profile-card]"
  ); // Selects the profile card element.
const /** { NodeElement } */ $repoPanel =
    document.querySelector("[data-repo-panel]"); // Selects the repository panel element.
const /** { NodeElement } */ $error = document.querySelector("[data-error]"); // Selects the error element.

window.updateProfile = function (profileUrl) {
  // Defines the `updateProfile` function which fetches and updates the profile information.
  $error.style.display = "none"; // Hides the error message if the profile is being updated.
  document.body.style.overflowY = "visible"; // Ensures the body is scrollable.

  $profileCard.innerHTML = `
    <div class="profile-skeleton">
        <div class="skeleton avatar-skeleton"></div>
        <div class="skeleton title-skeleton"></div>
        <div class="skeleton text-skeleton text-1"></div>
        <div class="skeleton text-skeleton text-2"></div>
        <div class="skeleton text-skeleton text-3"></div>
    </div>`; // Displays skeleton loading elements while the profile data is being fetched.

  $tabBtns[0].click(); // Triggers a click on the first tab to show its content.

  $repoPanel.innerHTML = `
    <div class="card repo-skeleton">
        <div class="card-body">
            <div class="skeleton title-skeleton"></div>
            <div class="skeleton text-skeleton text-1"></div>
            <div class="skeleton text-skeleton text-2"></div>
        </div>
        <div class="card-footer">
            <div class="skeleton text-skeleton"></div>
            <div class="skeleton text-skeleton"></div>
            <div class="skeleton text-skeleton"></div>
        </div>
    </div>
    `.repeat(6); // Displays skeletons for repositories until the data is fetched.

  fetchData(
    profileUrl, // Calls the `fetchData` function to fetch the profile data from GitHub.
    (data) => {
      const {
        type,
        avatar_url,
        html_url: githubPage,
        name,
        bio,
        login: username,
        location,
        company,
        blog: website,
        twitter_username,
        public_repos,
        followers,
        following,
        followers_url,
        following_url,
        repos_url,
      } = data; // Destructures the fetched data.

      repoUrl = repos_url; // Assigns the URL for repositories.
      followersUrl = followers_url; // Assigns the URL for followers.
      followingUrl = following_url.replace("{/other_user}", ""); // Assigns the URL for following.

      $profileCard.innerHTML = `
<figure class="${
        type === "User" ? "avatar-circle" : "avatar-rounded"
      } img-holder" style="--width: 280; --height: 280">
  <img
    src="${avatar_url}"
    width="280"
    height="280"
    alt="${username}"
    class="cover-img"
  />
</figure>

${name ? `<h1 class="title-2">${name}</h1>` : ""}

<p class="username text-primary">${username}</p>

${bio ? `<p class="bio">${bio}</p>` : ""}

<a href="${githubPage}" target="_blank" class="btn btn-secondary">
  <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
  <span class="span">See On GitHub</span>
</a>

<ul class="profile-meta">
  <!-- 1 -->
 ${
   location
     ? ` 
    <li class="meta-item">
    <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
    <span class="meta-text">${location}</span>
  </li>`
     : ""
 }

 <!-- 2 -->
${
  company
    ? `  <li class="meta-item">
    <span class="material-symbols-rounded" aria-hidden="true">apartment</span>
    <span class="meta-text">${company}</span>
  </li>`
    : ""
}

 <!-- 3 -->
${
  website
    ? `   <li class="meta-item">
    <span class="material-symbols-rounded" aria-hidden="true">captive_portal</span>
    <a href="${website}" target="_blank" class="meta-text">
     ${website.replace("https://", "")}
    </a>
  </li> `
    : ""
}

 <!-- 4 -->
 ${
   twitter_username
     ? ` <li class="meta-item">
    <span class="icon">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.9441 7.92638C19.9568 8.10403 19.9568 8.28173 19.9568 8.45938C19.9568 13.8781 15.8325 20.1218 8.29441 20.1218C5.97207 20.1218 3.81473 19.4492 2 18.2817C2.32996 18.3198 2.64719 18.3325 2.98984 18.3325C4.90605 18.3325 6.67004 17.6853 8.07867 16.5812C6.27664 16.5431 4.76648 15.3629 4.24617 13.7386C4.5 13.7766 4.75379 13.802 5.02031 13.802C5.38832 13.802 5.75637 13.7512 6.09898 13.6624C4.22082 13.2817 2.81215 11.632 2.81215 9.63958V9.58884C3.35781 9.89341 3.99238 10.0838 4.66492 10.1091C3.56086 9.37306 2.83754 8.11673 2.83754 6.6954C2.83754 5.93399 3.04055 5.23603 3.3959 4.62688C5.41367 7.11419 8.44668 8.73853 11.8477 8.91622C11.7842 8.61165 11.7461 8.29442 11.7461 7.97716C11.7461 5.71825 13.5736 3.87817 15.8451 3.87817C17.0253 3.87817 18.0913 4.3731 18.84 5.17259C19.7664 4.99493 20.6547 4.65228 21.4416 4.18274C21.137 5.13454 20.4898 5.93403 19.6395 6.44161C20.4644 6.35282 21.2639 6.12435 21.9999 5.80712C21.4416 6.61927 20.7436 7.34259 19.9441 7.92638Z"
          fill="var(--on-background)"
        ></path>
      </svg>
    </span>

    <a href="https://x.com/${twitter_username}" target="_blank" class="meta-text">@${twitter_username}</a>
  </li>`
     : ""
 }

</ul>

<ul class="profile-stats">
  <!-- 1 -->
  <li class="stat-item"><span class="body"> ${public_repos} </span> Repos</li>

  <!-- 2 -->
  <li class="stat-item"><span class="body"> ${numberToKilo(
    followers
  )} </span> Followers</li>

  <!-- 3 -->
  <li class="stat-item"><span class="body"> ${numberToKilo(
    following
  )} </span> Following</li>
</ul>

<div class="footer">
  <p class="copyright">&copy; 2024 @sudhanshu-j</p>
</div>`;

      updateRepository(); // Calls a function to update repository details after fetching the profile data.
    },
    () => {
      // If the fetch fails, show an error message.
      $error.style.display = "grid"; // Makes the error message visible.
      document.body.style.overflowY = "hidden"; // Disables scrolling on the body when an error occurs.

      $error.innerHTML = `
        <h2 class="title-1">Oops! :(</h2>
        <p class="text">Failed to fetch data. Please try again later.</p>
    `; // Displays a user-friendly error message.
    }
  );
};

updateProfile(apiUrl); // Initializes the profile update with the default API URL.

// Initialize an empty array for storing forked repositories.
let /** { Array } */ ForkedRepos = [];

// Function to update the repositories section.
const updateRepository = function () {
  // Fetch repositories data from the API with sorting options and pagination.
  fetchData(`${repoUrl}?sort=created&per_page=12`, function (data) {
    // Clear the repository panel before populating new data.
    $repoPanel.innerHTML = `
        <h2 class="sr-only">Repositories</h2>
    `;

    // Filter out forked repositories and store them in ForkedRepos.
    ForkedRepos = data.filter((item) => /** { Boolean } */ item.fork);

    // Filter out the repositories that are not forks.
    const /** { Array } */ repositories = data.filter((i) => !i.fork);

    // If there are any repositories, loop through each one and display them.
    if (repositories.length) {
      for (const repo of repositories) {
        const {
          name, // Repository name.
          html_url, // URL of the repository.
          description, // Description of the repository.
          private: isPrivate, // Boolean indicating if the repository is private.
          language, // Programming language used in the repository.
          stargazers_count: stars_count, // Number of stars the repository has.
          forks_count, // Number of forks the repository has.
        } = repo; // Destructure the repository data.

        // Create a new card element to display repository information.
        const /** { NodeElement } */ $repoCard =
            document.createElement("article");
        $repoCard.classList.add("card", "repo-card"); // Add classes for styling.

        // Add content to the card (repository details).
        $repoCard.innerHTML = `
            <div class="card-body">
                <a href="${html_url}" target="_blank" class="card-title">
                    <h3 class="title-3">${name}</h3>
                </a>

                ${description ? `<p class="card-text">${description}</p>` : ""}

                <span class="badge"> ${isPrivate ? "Private" : "Public"} </span>
            </div>

            <div class="card-footer">
                <!-- Display programming language if available -->
                ${
                  language
                    ? ` <div class="meta-item">
                    <span class="material-symbols-rounded" aria-hidden="true">code_blocks</span>
                    <span class="span">${language}</span>
                </div>`
                    : ""
                }

                <!-- Display stars count -->
                <div class="meta-item">
                    <span class="material-symbols-rounded" aria-hidden="true">star_rate</span>
                    <span class="span">${numberToKilo(stars_count)}</span>
                </div>

                <!-- Display forks count -->
                <div class="meta-item">
                    <span class="material-symbols-rounded" aria-hidden="true">family_history</span>
                    <span class="span">${numberToKilo(forks_count)}</span>
                </div>
            </div>`;

        // Append the repository card to the repository panel.
        $repoPanel.appendChild($repoCard);
      }
    } else {
      // If no repositories are found, display a message.
      $repoPanel.innerHTML = `
        <div class="error-content">
            <p class="title-1">Oops! :(</p>
            <p class="text">Doesn't have any public repositories yet.</p>
        </div>`;
    }
  });
};

// Function to update the forked repositories section.
const /** { NodeElement } */ $forkedPanel = document.querySelector(
    "[data-forked-panel]"
  ); // Get the forked panel element.
const /** { NodeElement } */ $forkTabBtn = document.querySelector(
    "[data-forked-tab-btn]"
  ); // Get the forked tab button.

const updateForkRepo = function () {
  // Clear the forked repositories panel before adding new data.
  $forkedPanel.innerHTML = `
      <h2 class="sr-only">Forked repositories</h2>`;

  // If there are any forked repositories, loop through and display them.
  if (ForkedRepos.length) {
    for (const repo of ForkedRepos) {
      const {
        name, // Repository name.
        html_url, // URL of the repository.
        description, // Description of the repository.
        private: isPrivate, // Boolean indicating if the repository is private.
        language, // Programming language used in the repository.
        stargazers_count: stars_count, // Number of stars the repository has.
        forks_count, // Number of forks the repository has.
      } = repo; // Destructure the forked repository data.

      // Create a new card element to display the forked repository.
      const /** { NodeElement } */ $forkCard =
          document.createElement("article");
      $forkCard.classList.add("card", "repo-card"); // Add classes for styling.

      // Add content to the card (forked repository details).
      $forkCard.innerHTML = `
            <div class="card-body">
                <a href="${html_url}" target="_blank" class="card-title">
                    <h3 class="title-3">${name}</h3>
                </a>
    
                ${description ? `<p class="card-text">${description}</p>` : ""}
    
                <span class="badge"> ${isPrivate ? "Private" : "Public"} </span>
            </div>
    
            <div class="card-footer">
                <!-- Display programming language if available -->
                ${
                  language
                    ? ` <div class="meta-item">
                    <span class="material-symbols-rounded" aria-hidden="true">code_blocks</span>
                    <span class="span">${language}</span>
                </div>`
                    : ""
                }

                <!-- Display stars count -->
                <div class="meta-item">
                    <span class="material-symbols-rounded" aria-hidden="true">star_rate</span>
                    <span class="span">${numberToKilo(stars_count)}</span>
                </div>

                <!-- Display forks count -->
                <div class="meta-item">
                    <span class="material-symbols-rounded" aria-hidden="true">family_history</span>
                    <span class="span">${numberToKilo(forks_count)}</span>
                </div>
            </div>`;

      // Append the forked repository card to the forked panel.
      $forkedPanel.appendChild($forkCard);
    }
  } else {
    // If no forked repositories are found, display a message.
    $forkedPanel.innerHTML = `
            <div class="error-content">
                <p class="title-1">Oops! :(</p>
                <p class="text">Doesn't have any forked repositories yet.</p>
            </div>`;
  }
};

// Event listener to trigger the updateForkRepo function when the forked tab is clicked.
$forkTabBtn.addEventListener("click", updateForkRepo);

// Function to update the followers section.
const /** { NodeElement } */ $followerTabBtn = document.querySelector(
    "[data-follower-tab-btn]"
  ); // Get the follower tab button.
const /** { NodeElement } */ $followerPanel = document.querySelector(
    "[data-follower-panel]"
  ); // Get the follower panel element.

const updateFollower = function () {
  // Show skeleton loading animation while fetching data.
  $followerPanel.innerHTML = `
      <div class="card follower-skeleton">
          <div class="skeleton avatar-skeleton"></div>
          <div class="skeleton title-skeleton"></div>
      </div>`.repeat(12);

  // Fetch follower data from the API.
  fetchData(followersUrl, function (data) {
    // Clear the follower panel before adding new data.
    $followerPanel.innerHTML = `
          <h2 class="sr-only">Followers</h2>
      `;

    // If there are followers, loop through and display them.
    if (data.length) {
      for (const item of data) {
        const { login: username, avatar_url, url } = item; // Destructure follower data.

        // Create a new card element for each follower.
        const /** { NodeElement } */ $followerCard =
            document.createElement("article");
        $followerCard.classList.add("card", "follower-card"); // Add classes for styling.

        // Add content to the follower card.
        $followerCard.innerHTML = `
      <figure class="avatar-circle img-holder">
          <img
              src="${avatar_url}&s=64"
              alt="${username}"
              class="cover-img"
              width="56"
              height="56"
              loading="lazy"
          />
      </figure>
  
          <h3 class="card-title">${username}</h3>
  
      <button class="icon-btn" onclick="updateProfile(\'${url}\')" aria-label="Go to ${username} profile">
          <span class="material-symbols-rounded" aria-hidden="true">link</span>
      </button>`;

        // Append the follower card to the follower panel.
        $followerPanel.appendChild($followerCard);
      }
    } else {
      // If no followers are found, display a message.
      $followerPanel.innerHTML = `
          <div class="error-content">
              <p class="title-1">Oops! :(</p>
              <p class="text">
                  Doesn't have any followers yet.
              </p>
          </div>`;
    }
  });
};

// Event listener to trigger the updateFollower function when the follower tab is clicked.
$followerTabBtn.addEventListener("click", updateFollower);

// Function to update the following section.
const /** { NodeElement } */ $followingTabBtn = document.querySelector(
    "[data-following-tab-btn]"
  ); // Get the following tab button.
const /** { NodeElement } */ $followingPanel = document.querySelector(
    "[data-following-panel]"
  ); // Get the following panel element.

const updateFollowing = function () {
  // Show skeleton loading animation while fetching data.
  $followingPanel.innerHTML = `
     <div class="card follower-skeleton">
          <div class="skeleton avatar-skeleton"></div>
          <div class="skeleton title-skeleton"></div>
      </div>`.repeat(12);

  // Fetch following data from the API.
  fetchData(followingUrl, function (data) {
    // Clear the following panel before adding new data.
    $followingPanel.innerHTML = `
    <h2 class="sr-only">Following</h2>`;

    // If there are users being followed, loop through and display them.
    if (data.length) {
      for (const item of data) {
        const { login: username, avatar_url, url } = item; // Destructure following data.

        // Create a new card element for each following user.
        const /** { NodeElement } */ $followingCard =
            document.createElement("article");
        $followingCard.classList.add("card", "follower-card"); // Add classes for styling.

        // Add content to the following card.
        $followingCard.innerHTML = `
        <figure class="avatar-circle img-holder">
            <img
                src="${avatar_url}&s=64"
                alt="${username}"
                class="cover-img"
                width="56"
                height="56"
                loading="lazy"
            />
        </figure>
    
            <h3 class="card-title">${username}</h3>
    
        <button class="icon-btn" onclick="updateProfile(\'${url}\')" aria-label="Go to ${username} profile">
            <span class="material-symbols-rounded" aria-hidden="true">link</span>
        </button>`;

        // Append the following card to the following panel.
        $followingPanel.appendChild($followingCard);
      }
    } else {
      // If no following users are found, display a message.
      $followingPanel.innerHTML = `
            <div class="error-content">
                <p class="title-1">Oops! :(</p>
                <p class="text">
                    Doesn't have any following yet.
                </p>
            </div>`;
    }
  });
};

// Event listener to trigger the updateFollowing function when the following tab is clicked.
$followingTabBtn.addEventListener("click", updateFollowing);
