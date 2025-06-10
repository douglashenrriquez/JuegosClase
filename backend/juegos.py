import mysql.connector
from mysql.connector import Error

class JuegoManager:
    def __init__(self):
        self.connection = self.crear_conexion()

    def crear_conexion(self):
        try:
            connection = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
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
        if self.connection:
            cursor = self.connection.cursor()

            # Cuántas veces ha jugado este juego el alumno
            query_ganadas = """
                SELECT COUNT(*) FROM estado_juego
                WHERE id_alumno = %s AND id_juego = %s AND estado = 'finalizado'
            """
            cursor.execute(query_ganadas, (id_alumno, id_juego))
            result = cursor.fetchone()
            veces_jugado = result[0] if result else 0

            # Cuántas vidas tiene el juego
            query_vida = "SELECT vida FROM juegos WHERE id = %s"
            cursor.execute(query_vida, (id_juego,))
            result = cursor.fetchone()
            vida = result[0] if result else 0

            cursor.close()

            return veces_jugado < vida  # True o False
        return False

