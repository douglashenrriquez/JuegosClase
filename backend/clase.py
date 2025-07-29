import mysql.connector
from mysql.connector import Error

db_config = {
    "host": "srv871982.hstgr.cloud",
    "user": "douglasadmin",
    "password": "Douglas1405.18",
    "database": "fisica"
}

def obtener_conexion():
    try:
        return mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error al conectar con MySQL: {e}")
        return None

def obtener_clases():
    conn = obtener_conexion()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM clase")
            clases = cursor.fetchall()
            cursor.close()
            return clases
        except Error as e:
            print(f"Error al obtener clases: {e}")
        finally:
            conn.close()
    return []

def crear_clase(nombre):
    conn = obtener_conexion()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO clase (nombre) VALUES (%s)", (nombre,))
            conn.commit()
            cursor.close()
            return True
        except Error as e:
            print(f"Error al crear clase: {e}")
        finally:
            conn.close()
    return False

def actualizar_clase(id_clase, nuevo_nombre):
    conn = obtener_conexion()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("UPDATE clase SET nombre = %s WHERE id_clase = %s", (nuevo_nombre, id_clase))
            conn.commit()
            cursor.close()
            return True
        except Error as e:
            print(f"Error al actualizar clase: {e}")
        finally:
            conn.close()
    return False

def eliminar_clase(id_clase):
    conn = obtener_conexion()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM clase WHERE id_clase = %s", (id_clase,))
            conn.commit()
            cursor.close()
            return True
        except Error as e:
            print(f"Error al eliminar clase: {e}")
        finally:
            conn.close()
    return False
