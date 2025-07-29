import mysql.connector
from mysql.connector import Error

# Configuración remota de MySQL (VPS)
db_config = {
    "host": "srv871982.hstgr.cloud",  # O usa directamente la IP: 31.97.139.53
    "user": "douglasadmin",
    "password": "Douglas1405.18",
    "database": "fisica"
}

try:
    print("Intentando conectar a la base de datos...")
    connection = mysql.connector.connect(**db_config)

    if connection.is_connected():
        print("✅ ¡Conexión exitosa a MySQL!")
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print("📄 Tablas encontradas en la base de datos:")
        for table in tables:
            print(" -", table[0])

except Error as e:
    print("❌ Error al conectar a MySQL:")
    print(e)

finally:
    if 'connection' in locals() and connection.is_connected():
        connection.close()
        print("🔒 Conexión cerrada.")
