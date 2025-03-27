'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const formUsuario = document.getElementById('registerForm');

    if (formUsuario) {
        formUsuario.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            // Verificar términos y condiciones
            const termsCheck = document.getElementById('termsCheck');
            if (!termsCheck.checked) {
                alert('Debes aceptar los términos y condiciones.');
                return;
            }

            console.log('Enviando datos:', { usuNombre: nombre, usuEmail: email, usuPassword: password });

            try {
                const response = await fetch('http://localhost:8080/project-AI/usuarioAG', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usuNombre: nombre,
                        usuEmail: email,
                        usuPassword: password
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message || 'Registro exitoso');
                    formUsuario.reset();
                    // Redirigir al usuario después del registro exitoso
                    window.location.href = '/pages/inicio.html'; // Ajusta la URL según tu proyecto
                } else {
                    console.error('Error:', data);
                    alert(data.message || 'Error al registrar usuario.');
                }
            } catch (error) {
                console.error('Error en la conexión con el servidor:', error);
                alert('Error en la conexión con el servidor.');
            }
        });
    }
});
