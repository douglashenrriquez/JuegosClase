import mysql.connector
from mysql.connector import Error

class JuegoManager:
    def __init__(self):
        self.connection = self.crear_conexion()

    def crear_conexion(self):
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

    def obtener_juegos(self):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
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
            return juegos
        return []

    def crear_juego(self, nombre, reglas, vida, puntos, id_clase, creadorjuego):
        if self.connection:
            cursor = self.connection.cursor()
            query = """
                INSERT INTO juegos (nombre, reglas, vida, puntos, id_clase, creadorjuego)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nombre, reglas, vida, puntos, id_clase, creadorjuego))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def actualizar_juego(self, id, nombre, reglas, vida, puntos, id_clase, creadorjuego):
        if self.connection:
            cursor = self.connection.cursor()
            query = """
                UPDATE juegos
                SET nombre = %s, reglas = %s, vida = %s, puntos = %s, id_clase = %s, creadorjuego = %s
                WHERE id = %s
            """
            cursor.execute(query, (nombre, reglas, vida, puntos, id_clase, creadorjuego, id))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def eliminar_juego(self, id):
        if self.connection:
            cursor = self.connection.cursor()
            query = "DELETE FROM juegos WHERE id = %s"
            cursor.execute(query, (id,))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def obtener_juegos_por_clase(self, id_clase):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
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
            return juegos
        return []

    def obtener_juegos_por_creador(self, creadorjuego):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
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
            return juegos
        return []

    def puede_jugar(self, id_alumno, id_juego):
        connection = self.crear_conexion()
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
            connection.close()  # << MUY IMPORTANTE

            return {
                "puede_jugar": veces_jugado < vida,
                "vidas_usadas": veces_jugado,
                "vidas_totales": vida
            }

