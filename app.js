let auth0 = null;

const fetchAuthConfig = function () {
  return fetch("auth_config.json");
};

const configureClient = async function () {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    useRefreshTokens: true,
    scope: "openid profile read:messages",
    audience: "https://quickstarts/api"
  });
};

window.onload = async () => {
  await configureClient();
  updateUI();

  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    // show the gated content
    return;
  }

  const query = window.location.search;
  const path = window.location.pathname;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    updateUI();

    window.history.replaceState({}, document.title, path);
  }
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  let gatedContent = document.getElementsByClassName("gated-content");

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-refresh-token").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  if (isAuthenticated) {
    gatedContent[0].classList.remove("hidden");
    gatedContent[1].classList.remove("hidden");

    document.getElementById(
      "ipt-access-token"
    ).innerHTML = await auth0.getTokenSilently();
    document.getElementById("ipt-user-profile").textContent = JSON.stringify(
      await auth0.getUser(),
      null,
      3
    );
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.href
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.href
  });
};

const refreshToken = async () => {
  const token = await auth0.getTokenSilently({
    ignoreCache: true
  });
  document.getElementById("ipt-access-token").innerHTML = token;
  document.getElementById("ipt-user-profile").textContent = JSON.stringify(
    await auth0.getUser(),
    null,
    3
  );
};

const callApi = async function () {
  console.log("not implemented");
};