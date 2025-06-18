from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# Configuración de conexión a MySQL remoto (VPS)
db_config = {
    "host": "srv871982.hstgr.cloud",
    "user": "douglasadmin",
    "password": "Douglas1405.18",
    "database": "fisica"
}

@app.route('/test-db', methods=['GET'])
def test_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)

        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            cursor.close()
            connection.close()

            return jsonify({
                "status": "success",
                "tables": [table[0] for table in tables]
            })

    except Error as err:
        return jsonify({
            "status": "error",
            "message": str(err)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
