import mysql.connector
from mysql.connector import Error

class ClaseManager:
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

    def obtener_clases(self):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM clase")
            clases = cursor.fetchall()
            cursor.close()
            return clases
        return []

    def crear_clase(self, nombre):
        if self.connection:
            cursor = self.connection.cursor()
            cursor.execute("INSERT INTO clase (nombre) VALUES (%s)", (nombre,))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def actualizar_clase(self, id_clase, nuevo_nombre):
        if self.connection:
            cursor = self.connection.cursor()
            cursor.execute("UPDATE clase SET nombre = %s WHERE id_clase = %s", (nuevo_nombre, id_clase))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def eliminar_clase(self, id_clase):
        if self.connection:
            cursor = self.connection.cursor()
            cursor.execute("DELETE FROM clase WHERE id_clase = %s", (id_clase,))
            self.connection.commit()
            cursor.close()
            return True
        return False
