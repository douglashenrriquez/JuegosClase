from flask import Flask, request, jsonify
from flask_cors import CORS
from clase import ClaseManager 
from alumno import AlumnoManager
from juegos import JuegoManager
from estado_juego import EstadoJuegoManager
import Login

app = Flask(__name__)
CORS(app)

clase_manager = ClaseManager()
alumno_manager = AlumnoManager()
juego_manager = JuegoManager()
estado_juego_manager = EstadoJuegoManager()
manager = EstadoJuegoManager()

#--------------------------------------------------------------------------------------
#LOGIN 

# =====================
# ENDPOINTS ADMINISTRADORES
# =====================

@app.route('/api/administradores', methods=['GET'])
def get_administradores():
    admins = Login.obtener_administradores()
    return jsonify(admins)

@app.route('/api/administradores', methods=['POST'])
def crear_admin():
    data = request.get_json()
    numero = data.get('numero')
    password = data.get('password')

    if not numero or not password:
        return jsonify({"success": False, "message": "Faltan campos"}), 400

    if Login.crear_administrador(numero, password):
        return jsonify({"success": True}), 201
    else:
        return jsonify({"success": False, "message": "Error al crear"}), 500

@app.route('/api/login_administrador', methods=['POST'])
def login_admin():
    data = request.get_json()
    numero = data.get('numero')
    password = data.get('password')

    if not numero or not password:
        return jsonify({"success": False, "message": "Faltan campos"}), 400

    resultado = Login.login_administrador(numero, password)

    if resultado:
        return jsonify({
            "success": True,
            "rol": "administrador",
            "datos": resultado
        }), 200
    else:
        return jsonify({"success": False, "message": "Número o contraseña incorrectos"}), 401

# =====================
# ENDPOINTS ALUMNOS
# =====================

@app.route('/api/login_alumno', methods=['POST'])
def login_alum():
    data = request.get_json()
    id_alumno = data.get('id')
    password = data.get('password')

    if not id_alumno or not password:
        return jsonify({"success": False, "message": "Faltan campos"}), 400

    resultado = Login.login_alumno(id_alumno, password)

    if resultado:
        return jsonify({
            "success": True,
            "rol": "alumno",
            "datos": resultado
        }), 200
    else:
        return jsonify({"success": False, "message": "ID o contraseña incorrectos"}), 401

#--------------------------------------------------------------------------------------
#CLASES 

#GET
@app.route('/api/clases', methods=['GET'])
def get_clases():
    clases = clase_manager.obtener_clases()
    return jsonify(clases)

#POST
@app.route('/api/clases', methods=['POST'])
def crear_clase():
    data = request.get_json()
    nombre = data.get('nombre')
    
    if nombre and clase_manager.crear_clase(nombre):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Error al crear clase"}), 400
    
#PUT
@app.route('/api/clases/<int:id_clase>', methods=['PUT'])
def actualizar_clase(id_clase):
    data = request.get_json()
    nuevo_nombre = data.get('nombre')
    
    if nuevo_nombre and clase_manager.actualizar_clase(id_clase, nuevo_nombre):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Error al actualizar clase"}), 400
    
#DELETE

@app.route('/api/clases/<int:id_clase>', methods=['DELETE'])
def eliminar_clase(id_clase):
    if clase_manager.eliminar_clase(id_clase):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Error al eliminar clase"}), 400
    
#--------------------------------------------------------------------------------------
#ALUMNOS

#GET
@app.route('/api/alumnos', methods=['GET'])
def get_alumnos():
    alumnos = alumno_manager.obtener_alumnos()
    return jsonify(alumnos)

@app.route('/api/alumnos/clase/<int:id_clase>', methods=['GET'])
def get_alumnos_por_clase(id_clase):
    alumnos = alumno_manager.obtener_alumnos_por_clase(id_clase)
    return jsonify(alumnos)

#POST
@app.route('/api/alumnos', methods=['POST'])
def crear_alumno():
    data = request.get_json()
    if alumno_manager.crear_alumno(
        data.get('id'),
        data.get('nombre'),
        data.get('password'),
        data.get('id_clase'),
        data.get('puntos')
    ):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False}), 400
    
@app.route('/api/alumnos/sumar-puntos', methods=['POST'])
def sumar_puntos_alumno():
    data = request.get_json()
    id_alumno = data.get("id_alumno")
    puntos_extra = data.get("puntos")

    alumnos = alumno_manager.obtener_alumnos()
    alumno = next((a for a in alumnos if a['id'] == id_alumno), None)

    if alumno:
        nuevos_puntos = alumno['puntos'] + puntos_extra
        actualizado = alumno_manager.actualizar_alumno(
            id_alumno,
            alumno['nombre'],
            alumno['password'],
            alumno['id_clase'],
            nuevos_puntos
        )
        return jsonify({"success": actualizado})
    
    return jsonify({"success": False, "error": "Alumno no encontrado"}), 404

@app.route('/api/alumnos/perder', methods=['POST'])
def alumno_perdio():
    data = request.get_json()
    id_alumno = data.get("id_alumno")
    vida_perdida = data.get("vida", 1)  # Puedes personalizar la cantidad de vida que pierde

    alumnos = alumno_manager.obtener_alumnos()
    alumno = next((a for a in alumnos if a['id'] == id_alumno), None)

    if alumno:
        nueva_vida = max(alumno['vida'] - vida_perdida, 0)  # Evitar que quede en negativo
        actualizado = alumno_manager.actualizar_alumno(
            id_alumno,
            alumno['nombre'],
            alumno['password'],
            alumno['id_clase'],
            alumno['puntos'],  # No se suman puntos
            nueva_vida
        )
        return jsonify({"success": actualizado})

    return jsonify({"success": False, "error": "Alumno no encontrado"}), 404


    
#PUT
@app.route('/api/alumnos/<string:id>', methods=['PUT'])
def actualizar_alumno(id):
    data = request.get_json()
    if alumno_manager.actualizar_alumno(
        id,
        data.get('nombre'),
        data.get('password'),
        data.get('id_clase'),
        data.get('puntos')
    ):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False}), 400
    
#DELETE

@app.route('/api/alumnos/<string:id>', methods=['DELETE'])
def eliminar_alumno(id):
    if alumno_manager.eliminar_alumno(id):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False}), 400

#--------------------------------------------------------------------------------------
#JUEGOS

#GET
@app.route('/api/juegos', methods=['GET'])
def get_juegos():
    juegos = juego_manager.obtener_juegos()
    return jsonify(juegos)

@app.route('/api/juegos/por-clase/<int:id_clase>', methods=['GET'])
def obtener_juegos_por_clase(id_clase):
    try:
        juegos = juego_manager.obtener_juegos_por_clase(id_clase)
        return jsonify(juegos)
    except Exception as e:
        print("Error al obtener juegos:", e)
        return jsonify({"error": "Error al obtener juegos"}), 500

@app.route('/api/juegos/por-creador/<creadorjuego>', methods=['GET'])
def obtener_juegos_por_creador(creadorjuego):
    try:
        juegos = juego_manager.obtener_juegos_por_creador(creadorjuego)
        return jsonify(juegos)
    except Exception as e:
        print("Error al obtener juegos por creador:", e)
        return jsonify({"error": "Error al obtener juegos por creador"}), 500
    
@app.route('/api/juegos/puede_jugar/<string:id_alumno>/<int:id_juego>', methods=['GET'])
def api_puede_jugar(id_alumno, id_juego):
    try:
        resultado = juego_manager.puede_jugar(id_alumno, id_juego)
        return jsonify({
            "puede_jugar": resultado['puede_jugar'],
            "vidas_usadas": resultado['vidas_usadas'],
            "vidas_totales": resultado['vidas_totales']
        })
    except Exception as e:
        print("Error en puede_jugar:", e)
        return jsonify({"success": False, "error": str(e)}), 500


#POST
@app.route('/api/juegos', methods=['POST'])
def crear_juego():
    data = request.get_json()
    nombre = data.get('nombre')
    reglas = data.get('reglas')
    vida = data.get('vida')
    puntos = data.get('puntos')  
    id_clase = data.get('id_clase')
    creadorjuego = data.get('creadorjuego')  # <-- ¡AGREGA ESTO!

    if nombre and reglas and vida is not None and puntos is not None and id_clase is not None and creadorjuego is not None:
        if juego_manager.crear_juego(nombre, reglas, vida, puntos, id_clase, creadorjuego):
            return jsonify({"success": True})

    return jsonify({"success": False, "message": "Error al crear juego"}), 400


#PUT
@app.route('/api/juegos/<int:id>', methods=['PUT'])
def actualizar_juego(id):
    data = request.get_json()
    nombre = data.get('nombre')
    reglas = data.get('reglas')
    vida = data.get('vida')
    puntos = data.get('puntos')
    id_clase = data.get('id_clase')
    creadorjuego = data.get('creadorjuego')  # ✅ importante

    if not all([nombre, reglas, vida is not None, puntos is not None, id_clase, creadorjuego]):
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    actualizado = juego_manager.actualizar_juego(id, nombre, reglas, vida, puntos, id_clase, creadorjuego)
    if actualizado:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "No se pudo actualizar"}), 500

#DELETE
@app.route('/api/juegos/<int:id>', methods=['DELETE'])
def eliminar_juego(id):
    if juego_manager.eliminar_juego(id):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Error al eliminar juego"}), 400
    
# -----------------------------------------------------------------------------------------
# ESTADO DE JUEGO DE ALUMNO

# POST - Guardar juego actual
@app.route('/api/estado_juego', methods=['POST'])
def guardar_estado_juego():
    data = request.get_json()
    id_alumno = data.get('id_alumno')
    id_juego = data.get('id_juego')

    if not id_alumno or not id_juego:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    if estado_juego_manager.guardar_estado_juego(id_alumno, id_juego):
        return jsonify({"success": True, "message": "Estado guardado correctamente"})
    else:
        return jsonify({"success": False, "message": "Error al guardar estado"}), 500


@app.route('/api/estado_juego/finalizar', methods=['POST'])
def finalizar_estado_juego():
    data = request.get_json()
    id_estado = data.get('id_estado')

    if not id_estado:
        return jsonify({"success": False, "message": "Falta id_estado"}), 400

    resultado = estado_juego_manager.finalizar_juego_por_id(id_estado)
    if resultado:
        return jsonify({"success": True, "message": "Juego finalizado correctamente"})
    else:
        return jsonify({"success": False, "message": "No se pudo finalizar el juego"}), 500



# GET - Obtener juego actual por alumno
@app.route('/api/estado_juego/<string:id_alumno>', methods=['GET'])
def obtener_estado_juego(id_alumno):
    estado = estado_juego_manager.obtener_estado_juego(id_alumno)
    if estado:
        return jsonify({"success": True, "estado": estado})
    else:
        return jsonify({"success": False, "message": "El alumno no está jugando ningún juego"}), 404
    

@app.route('/api/historial_juegos/<string:id_alumno>', methods=['GET'])
def obtener_historial_juegos(id_alumno):
    historial = estado_juego_manager.obtener_historial_juegos(id_alumno)
    if historial is not None:
        return jsonify({"success": True, "historial": historial})
    else:
        return jsonify({"success": False, "message": "Error al obtener el historial"}), 500


if __name__ == '__main__':
    CORS(app)
    app.run(host='0.0.0.0', port=5001, debug=True)
