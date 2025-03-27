document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("btnBuscar").addEventListener("click", buscarEventos);
    document.getElementById("btnLogout").addEventListener("click", cerrarSesion);
    document.getElementById("btnEventosUsuario").addEventListener("click", obtenerEventosPorUsuario);

    await obtenerUsuario();
});

let usuarioGlobal = null;

async function obtenerUsuario() {
    try {
        const token = localStorage.getItem("jwtToken");
        if (!token || !token.startsWith("Bearer ")) {
            throw new Error("No hay token disponible o es inválido");
        }

        const response = await fetch("http://localhost:8080/project-AI/usuarios/auth", {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Sesión expirada, inicie sesión nuevamente");
            throw new Error("Error al obtener usuario");
        }

        usuarioGlobal = await response.json();
        console.log("Usuario autenticado:", usuarioGlobal);

        document.getElementById("usuario-info").textContent = `Bienvenido, ${usuarioGlobal.usuNombre}`;
        document.getElementById("btnLogout").classList.remove("d-none");

    } catch (error) {
        console.error("Error al obtener usuario:", error);
        alert(error.message);
        localStorage.removeItem("jwtToken");
        window.location.href = "/pages/sesion.html";
    }
}

function cerrarSesion() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/pages/inicio.html';
}

async function buscarEventos() {
    const consulta = document.getElementById("consulta").value.trim();
    const resultsContainer = document.getElementById("resultsContainer");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("error-message");

    resultsContainer.innerHTML = "";
    errorMessage.classList.add("d-none");
    loading.classList.remove("d-none");

    if (!consulta) {
        errorMessage.textContent = "Por favor, ingrese un tema para buscar eventos.";
        errorMessage.classList.remove("d-none");
        loading.classList.add("d-none");
        return;
    }

    let token = localStorage.getItem("jwtToken");
    if (!token) {
        errorMessage.textContent = "No tienes sesión iniciada.";
        errorMessage.classList.remove("d-none");
        loading.classList.add("d-none");
        return;
    }

    if (!token.startsWith("Bearer ")) {
        token = `Bearer ${token}`;
    }

    try {
        const response = await fetch("http://localhost:8080/project-AI/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                consulta,
                usuId: usuarioGlobal ? usuarioGlobal.usuId : null
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al obtener eventos");
        }

        setTimeout(() => {
            loading.classList.add("d-none");

            if (!Array.isArray(data) || data.length === 0) {
                errorMessage.textContent = "No se encontraron eventos.";
                errorMessage.classList.remove("d-none");
                return;
            }

            resultsContainer.innerHTML = `
                <div class="row">
                    ${data.map(evento => `
                        <div class="col-12 col-md-6 col-lg-4 mb-4">
                            <div class="event-card h-100">
                                <div class="event-body card-body">
                                    <h3 class="event-title card-title">${evento.eveTitulo}</h3>
                                    <p class="event-description card-text">${evento.eveDescripcion || 'Descripción no disponible'}</p>
                                    
                                    <div class="event-details">
                                        <div class="detail-item">
                                            <i class="bi bi-calendar"></i>
                                            <span>${formatearFecha(evento.eveFechaInicio)} - ${formatearFecha(evento.eveFechaFin)}</span>
                                        </div>
                                        <div class="detail-item">
                                            <i class="bi bi-geo-alt"></i>
                                            <span>${evento.eveUbicacion || "Ubicación no disponible"}</span>
                                        </div>
                                    </div>
                                    
                                    ${evento.eveEnlace ? `
                                    <a href="${evento.eveEnlace}" target="_blank" rel="noopener noreferrer" class="event-link btn btn-primary mt-2">
                                        <i class="bi bi-link-45deg"></i> Ver evento
                                    </a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        }, 500);
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("d-none");
        loading.classList.add("d-none");
    }
}

async function obtenerEventosPorUsuario() {
    const resultsContainer = document.getElementById("resultsContainer");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("error-message");

    resultsContainer.innerHTML = "";
    errorMessage.classList.add("d-none");
    loading.classList.remove("d-none");

    try {
        const token = localStorage.getItem("jwtToken");
        if (!token || !token.startsWith("Bearer ")) {
            throw new Error("No hay token disponible o es inválido");
        }

        const response = await fetch("http://localhost:8080/project-AI/eventosU", {
            method: "GET",
            headers: {
                "Authorization": token, 
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            if (response.status === 401) throw new Error("Sesión expirada. Inicie sesión nuevamente.");
            if (response.status === 404) throw new Error("Usuario no encontrado.");
            throw new Error("Error al obtener los eventos.");
        }

        const eventos = await response.json();
        loading.classList.add("d-none");

        if (!Array.isArray(eventos) || eventos.length === 0) {
            errorMessage.textContent = "No hay eventos asociados a este usuario.";
            errorMessage.classList.remove("d-none");
            return;
        }

        resultsContainer.innerHTML = `
            <div class="row">
                ${eventos.map(evento => `
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="event-card h-100">  
                            <div class="event-body card-body">
                                <h3 class="event-title card-title">${evento.eveTitulo}</h3>
                                <p class="event-description card-text">${evento.eveDescripcion || 'Descripción no disponible'}</p>
                                
                                <div class="event-details">
                                    <div class="detail-item">
                                        <i class="bi bi-calendar"></i>
                                        <span>${formatearFecha(evento.eveFechaInicio)} - ${formatearFecha(evento.eveFechaFin)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <i class="bi bi-geo-alt"></i>
                                        <span>${evento.eveUbicacion || "Ubicación no disponible"}</span>
                                    </div>
                                </div>
                                
                                ${evento.eveEnlace ? `
                                <a href="${evento.eveEnlace}" target="_blank" rel="noopener noreferrer" class="event-link btn btn-primary mt-2">
                                    <i class="bi bi-link-45deg"></i> Ver evento
                                </a>
                                ` : ''}
                                
                                <div class="event-status mt-2">
                                    <span class="badge ${evento.eveEstado === 'ACTIVO' ? 'bg-success' : 'bg-secondary'}">
                                        ${evento.eveEstado}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

    } catch (error) {
        console.error("Error al obtener eventos del usuario:", error);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("d-none");
        loading.classList.add("d-none");
    }
}

function formatearFecha(fecha) {
    if (!fecha) return "Fecha no disponible";
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}