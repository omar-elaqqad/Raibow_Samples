
function handleLoginButtonClick() {
    // Redirect the user to the login endpoint
    window.location.href = "/login";
    redirectToRainbowAuthentication();
}

function redirectToRainbowAuthentication() {
    var rainbowAuthURI = "https://sandbox.openrainbow.com/api/rainbow/authentication/v1.0/oauth/authorize?response_type=token&client_id=69b09490015611ef9f25994f9ae1ef66&redirect_uri=https://127.0.0.1:8888/&scope=all";
    //window.location.href = rainbowAuthURI;

    window.location.replace(rainbowAuthURI);

    //handleRainbowAuthenticationRedirect();
}


document.getElementById('loginBtn').addEventListener('click', handleLoginButtonClick);