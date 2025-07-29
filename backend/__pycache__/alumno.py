import mysql.connector
from mysql.connector import Error

class AlumnoManager:
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

    def obtener_alumnos(self):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            query = """
                SELECT a.id, a.nombre, a.password, a.puntos, a.id_clase, c.nombre AS nombre_clase
                FROM alumnos a
                LEFT JOIN clase c ON a.id_clase = c.id_clase
            """
            cursor.execute(query)
            alumnos = cursor.fetchall()
            cursor.close()
            return alumnos
        return []

    def crear_alumno(self, id, nombre, password, id_clase, puntos):
        if self.connection:
            cursor = self.connection.cursor()
            query = "INSERT INTO alumnos (id, nombre, password, id_clase, puntos) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (id, nombre, password, id_clase, puntos))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def actualizar_alumno(self, id, nombre, password, id_clase, puntos):
        if self.connection:
            cursor = self.connection.cursor()
            query = "UPDATE alumnos SET nombre = %s, password = %s, id_clase = %s, puntos = %s WHERE id = %s"
            cursor.execute(query, (nombre, password, id_clase, puntos, id))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def eliminar_alumno(self, id):
        if self.connection:
            cursor = self.connection.cursor()
            query = "DELETE FROM alumnos WHERE id = %s"
            cursor.execute(query, (id,))
            self.connection.commit()
            cursor.close()
            return True
        return False
        
    def obtener_alumnos_por_clase(self, id_clase):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            query = """
                SELECT a.id, a.nombre, a.password, a.puntos, a.id_clase, c.nombre AS nombre_clase
                FROM alumnos a
                LEFT JOIN clase c ON a.id_clase = c.id_clase
                WHERE a.id_clase = %s
            """
            cursor.execute(query, (id_clase,))
            alumnos = cursor.fetchall()
            cursor.close()
            return alumnos
        return []
