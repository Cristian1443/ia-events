'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('loginForm');

    if (formLogin) {
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();
        
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
        
            if (!email || !password) {
                alert("Por favor, ingresa tu correo y contraseña.");
                return;
            }
        
            try {
                const response = await fetch("http://localhost:8080/project-AI/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Error en las credenciales");
                }

                console.log("Respuesta del backend:", data);

                if (data.token) {
                    localStorage.setItem("jwtToken", `Bearer ${data.token}`); // Almacenar token con formato correcto
                    window.location.href = "/index.html";
                } else {
                    alert("Error: No se recibió el token de autenticación.");
                }

            } catch (error) {
                console.error("Error en el login:", error);
                alert("Error al iniciar sesión. Verifique sus credenciales.");
            }
        });
    }
});
