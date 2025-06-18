import mysql.connector
from mysql.connector import Error

class EstadoJuegoManager:
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
            print(f"Error al conectar con MySQL: {e}")
            return None

    def guardar_estado_juego(self, id_alumno, id_juego):
        if self.connection:
            cursor = self.connection.cursor()
            try:
                cursor.execute(
                    "INSERT INTO estado_juego (id_alumno, id_juego) VALUES (%s, %s)",
                    (id_alumno, id_juego)
                )
                self.connection.commit()
                cursor.close()
                return True
            except Exception as e:
                print(f"Error al guardar estado de juego: {e}")
                return False
        return False

    def obtener_estado_juego(self, id_alumno):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            try:
                query = """
                    SELECT ej.id, j.nombre AS juego, j.puntos, j.reglas, j.vida, ej.fecha_inicio
                    FROM estado_juego ej
                    JOIN juegos j ON ej.id_juego = j.id
                    WHERE ej.id_alumno = %s AND ej.estado = 'jugando'
                    ORDER BY ej.fecha_inicio DESC
                    LIMIT 1
                """
                cursor.execute(query, (id_alumno,))
                resultado = cursor.fetchone()
                cursor.close()
                return resultado
            except Exception as e:
                print(f"Error al obtener estado de juego: {e}")
                return None
        return None

    def obtener_historial_juegos(self, id_alumno):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            try:
                query = """
                    SELECT ej.id, j.nombre AS juego, j.puntos, j.reglas, j.vida, ej.fecha_inicio, ej.estado
                    FROM estado_juego ej
                    JOIN juegos j ON ej.id_juego = j.id
                    WHERE ej.id_alumno = %s
                    ORDER BY ej.fecha_inicio DESC
                """
                cursor.execute(query, (id_alumno,))
                historial = cursor.fetchall()
                cursor.close()
                return historial
            except Exception as e:
                print(f"Error al obtener historial de juegos: {e}")
                return None
        return None

    def finalizar_juego_por_id(self, id_estado):
        if self.connection:
            cursor = self.connection.cursor()
            try:
                query = """
                    UPDATE estado_juego
                    SET estado = 'finalizado'
                    WHERE id = %s AND estado = 'jugando'
                """
                cursor.execute(query, (id_estado,))
                self.connection.commit()
                cursor.close()
                return True
            except Exception as e:
                print(f"Error al finalizar juego por ID: {e}")
                return False
        return False

