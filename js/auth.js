// js/auth.js

document.getElementById("google-login").addEventListener("click", function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Usuario autenticado:", result.user);
            alert("Bienvenido " + result.user.displayName);
        })
        .catch((error) => {
            console.error("Error en autenticación:", error);
        });
});

document.getElementById("facebook-login").addEventListener("click", function () {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Usuario autenticado con Facebook:", result.user);
            alert("Bienvenido " + result.user.displayName);
        })
        .catch((error) => {
            console.error("Error en autenticación con Facebook:", error);
        });
});

document.getElementById("x-login").addEventListener("click", function () {
    const provider = new firebase.auth.OAuthProvider('twitter.com');
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Usuario autenticado con X:", result.user);
            alert("Bienvenido " + result.user.displayName);
        })
        .catch((error) => {
            console.error("Error en autenticación con X:", error);
        });
});