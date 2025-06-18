import mysql.connector
from mysql.connector import Error

# =======================
# CONEXIÓN A LA BASE DE DATOS
# =======================
def get_connection():
    try:
        return mysql.connector.connect(
            host="srv871982.hstgr.cloud",
            user="douglasadmin",
            password="Douglas1405.18",
            database="fisica",
            autocommit=True
        )
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

# =======================
# FUNCIONES PARA ADMINISTRADORES
# =======================

def crear_administrador(numero, password):
    conn = get_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = "INSERT INTO administradores (numero, password) VALUES (%s, %s)"
            cursor.execute(query, (numero, password))
            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Error as e:
            print(f"Error al crear administrador: {e}")
    return False

def obtener_administradores():
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM administradores")
        resultados = cursor.fetchall()
        cursor.close()
        conn.close()
        return resultados
    return []

def login_administrador(numero, password):
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM administradores WHERE numero = %s AND password = %s"
        cursor.execute(query, (numero, password))
        admin = cursor.fetchone()
        cursor.close()
        conn.close()
        return admin
    return None

# =======================
# FUNCIONES PARA ALUMNOS
# =======================

def login_alumno(id_alumno, password):
    conn = get_connection()
    if conn:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM alumnos WHERE BINARY id = %s AND BINARY password = %s"
        cursor.execute(query, (id_alumno, password))
        alumno = cursor.fetchone()
        cursor.close()
        conn.close()

        if alumno:
            return {
                "id": alumno["id"],
                "nombre": alumno["nombre"],
                "id_clase": alumno["id_clase"]
            }
    return None
