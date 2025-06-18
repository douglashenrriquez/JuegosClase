function buscarEstado() {
    const idAlumno = document.getElementById('inputID').value.trim();
    const resultadoDiv = document.getElementById('resultadoEstado');
    resultadoDiv.innerHTML = '';

    if (!idAlumno) {
        resultadoDiv.innerHTML = `<div class="alert alert-warning">Por favor, ingresa un ID.</div>`;
        return;
    }
    fetch(`http://localhost:5000/api/estado_juego/${idAlumno}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const estado = data.estado;

                const cardHTML = `
                    <div class="card mt-4">
                        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">${estado.juego}</h5>
                            <div>
                                <button id="btnGanar" class="btn btn-warning btn-sm me-2">🏆 Ganar</button>
                                <button id="btnPerder" class="btn btn-danger btn-sm">💀 Perder</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <p><strong>ID del Estado:</strong> ${estado.id}</p>
                            <p><strong>Fecha de Inicio:</strong> ${new Date(estado.fecha_inicio).toLocaleString()}</p>
                            <p><strong>Reglas:</strong> ${estado.reglas}</p>
                            <p><strong>Puntos:</strong> ${estado.puntos}</p>
                            <p><strong>Vida:</strong> ${estado.vida}</p>
                        </div>
                    </div>
                `;

                resultadoDiv.innerHTML = cardHTML;

                // Acción del botón Ganar
                document.getElementById('btnGanar').addEventListener('click', async () => {
                    document.querySelector('.modal-body').textContent = "¿Estás seguro de que el alumno ha ganado el juego?";
                    $('#modalConfirmacion').modal('show');  
                    document.getElementById('btnConfirmar').onclick = async () => {
                        $('#modalConfirmacion').modal('hide');
                        
                        await fetch('http://localhost:5000/api/alumnos/sumar-puntos', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id_alumno: idAlumno,
                                puntos: estado.puntos
                            })
                        });

                        try {
                            const response = await fetch('http://localhost:5000/api/estado_juego/finalizar', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id_estado: estado.id
                                })
                            });

                            if (!response.ok) throw new Error("Error al finalizar el juego");
                            Swal.fire({
                                icon: 'success',
                                title: 'Juego Finalizado',
                                text: 'El alumno ahora puede elegir otro juego.'
                            });

                            buscarEstado();
                        } catch (error) {
                            console.error("Error al finalizar el juego:", error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo finalizar el juego.'
                            });
                        }
                    };
                });
                // Acción del botón Perder
                document.getElementById('btnPerder').addEventListener('click', async () => {
                    document.querySelector('.modal-body').textContent = "¿Estás seguro de que el alumno ha perdido el juego?";
                    $('#modalConfirmacion').modal('show');  
                    document.getElementById('btnConfirmar').onclick = async () => {
                        $('#modalConfirmacion').modal('hide');
                        
                        await fetch('http://localhost:5000/api/alumnos/sumar-puntos', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id_alumno: idAlumno,
                                puntos: 0 
                            })
                        });

                        try {
                            const response = await fetch('http://localhost:5000/api/estado_juego/finalizar', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id_estado: estado.id
                                })
                            });

                            if (!response.ok) throw new Error("Error al finalizar el juego");
                            Swal.fire({
                                icon: 'error',
                                title: 'Juego Perdido',
                                text: 'El alumno ha perdido el juego.'
                            });

                            buscarEstado();
                        } catch (error) {
                            console.error("Error al finalizar el juego:", error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo finalizar el juego.'
                            });
                        }
                    };
                });
            } else {
                resultadoDiv.innerHTML = `<div class="alert alert-info">El alumno no está jugando ningún juego actualmente.</div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultadoDiv.innerHTML = `<div class="alert alert-danger">Hubo un error al obtener el estado.</div>`;
        });
}
