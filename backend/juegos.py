import mysql.connector
from mysql.connector import Error

def crear_conexion():
    try:
        connection = mysql.connector.connect(
            host="srv871982.hstgr.cloud",
            user="douglasadmin",
            password="Douglas1405.18",
            database="fisica"
        )
        return connection
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

def obtener_juegos():
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT juegos.id, juegos.nombre, juegos.reglas, juegos.vida, juegos.puntos,
                   juegos.id_clase, clase.nombre AS nombre_clase,
                   juegos.creadorjuego, alumnos.nombre AS nombre_creador
            FROM juegos
            LEFT JOIN clase ON juegos.id_clase = clase.id_clase
            LEFT JOIN alumnos ON juegos.creadorjuego = alumnos.id
        """
        cursor.execute(query)
        juegos = cursor.fetchall()
        cursor.close()
        connection.close()
        return juegos
    return []

def crear_juego(nombre, reglas, vida, puntos, id_clase, creadorjuego):
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor()
        query = """
            INSERT INTO juegos (nombre, reglas, vida, puntos, id_clase, creadorjuego)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (nombre, reglas, vida, puntos, id_clase, creadorjuego))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    return False

def actualizar_juego(id, nombre, reglas, vida, puntos, id_clase, creadorjuego):
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor()
        query = """
            UPDATE juegos
            SET nombre = %s, reglas = %s, vida = %s, puntos = %s, id_clase = %s, creadorjuego = %s
            WHERE id = %s
        """
        cursor.execute(query, (nombre, reglas, vida, puntos, id_clase, creadorjuego, id))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    return False

def eliminar_juego(id):
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor()
        query = "DELETE FROM juegos WHERE id = %s"
        cursor.execute(query, (id,))
        connection.commit()
        cursor.close()
        connection.close()
        return True
    return False

def obtener_juegos_por_clase(id_clase):
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT juegos.id, juegos.nombre, juegos.reglas, juegos.vida, juegos.puntos,
                   juegos.id_clase, clase.nombre AS nombre_clase,
                   juegos.creadorjuego, alumnos.nombre AS nombre_creador
            FROM juegos
            LEFT JOIN clase ON juegos.id_clase = clase.id_clase
            LEFT JOIN alumnos ON juegos.creadorjuego = alumnos.id
            WHERE juegos.id_clase = %s
        """
        cursor.execute(query, (id_clase,))
        juegos = cursor.fetchall()
        cursor.close()
        connection.close()
        return juegos
    return []

def obtener_juegos_por_creador(creadorjuego):
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT juegos.id, juegos.nombre, juegos.reglas, juegos.vida, juegos.puntos,
                   juegos.id_clase, clase.nombre AS nombre_clase,
                   juegos.creadorjuego, alumnos.nombre AS nombre_creador
            FROM juegos
            LEFT JOIN clase ON juegos.id_clase = clase.id_clase
            LEFT JOIN alumnos ON juegos.creadorjuego = alumnos.id
            WHERE juegos.creadorjuego = %s
        """
        cursor.execute(query, (creadorjuego,))
        juegos = cursor.fetchall()
        cursor.close()
        connection.close()
        return juegos
    return []

def puede_jugar(id_alumno, id_juego):
    connection = crear_conexion()
    if connection:
        cursor = connection.cursor(dictionary=True)

        query_jugadas = """
            SELECT COUNT(*) AS jugadas FROM estado_juego
            WHERE id_alumno = %s AND id_juego = %s
        """
        cursor.execute(query_jugadas, (id_alumno, id_juego))
        veces_jugado = cursor.fetchone()['jugadas']

        query_vida = "SELECT vida FROM juegos WHERE id = %s"
        cursor.execute(query_vida, (id_juego,))
        vida = cursor.fetchone()['vida']

        cursor.close()
        connection.close()

        return {
            "puede_jugar": veces_jugado < vida,
            "vidas_usadas": veces_jugado,
            "vidas_totales": vida
        }
    return {
        "puede_jugar": False,
        "vidas_usadas": 0,
        "vidas_totales": 0
    }
