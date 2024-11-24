import psycopg2

try:
    conn = psycopg2.connect(
        dbname="brello",
        user="brello_user",
        password="brello_password",
        host="localhost"
    )
    print("Brello database connection successful")
    conn.close()
except Exception as e:
    print(f"Brello database connection failed: {e}")
