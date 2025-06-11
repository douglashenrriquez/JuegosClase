import mysql.connector
from mysql.connector import Error

class LoginManager:
    def __init__(self):
        self.connection = self.create_connection()
    
    def create_connection(self):
        """Crea la conexión a la BD 'fisica'."""
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
    
    def crear_administrador(self, numero, password):
        """Crea un nuevo administrador."""
        if self.connection:
            cursor = self.connection.cursor()
            query = "INSERT INTO administradores (numero, password) VALUES (%s, %s)"
            cursor.execute(query, (numero, password))
            self.connection.commit()
            cursor.close()
            return True
        return False

    def obtener_administradores(self):
        """Obtiene todos los administradores."""
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            query = "SELECT * FROM administradores"
            cursor.execute(query)
            admins = cursor.fetchall()
            cursor.close()
            return admins
        return []

    def cerrar_conexion(self):
        """Cierra la conexión a la BD."""
        if self.connection:
            self.connection.close()

    def login_unificado(self, numero, password):
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)

            # Buscar en administradores por 'numero'
            query_admin = "SELECT * FROM administradores WHERE numero = %s AND password = %s"
            cursor.execute(query_admin, (numero, password))
            admin = cursor.fetchone()
            if admin:
                cursor.close()
                return {"rol": "administrador", "datos": admin}

            # Buscar en alumnos por 'id' (usando 'numero' como id)
            query_alumno = "SELECT * FROM alumnos WHERE id = %s AND password = %s"
            cursor.execute(query_alumno, (numero, password))
            alumno = cursor.fetchone()
            cursor.close()

            if alumno:
                return {"rol": "alumno", "datos": alumno}

        return None


        return None
    def obtener_alumnos(self):
        
        if self.connection:
            cursor = self.connection.cursor(dictionary=True)
            query = "SELECT * FROM alumnos"
            cursor.execute(query)
            admins = cursor.fetchall()
            cursor.close()
            return admins
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
