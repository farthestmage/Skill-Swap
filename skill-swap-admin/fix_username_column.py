from db import get_db

def print_user_columns():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
    """)
    cols = cur.fetchall()
    print([c[0] for c in cols])
    cur.close()
    conn.close()

if __name__ == "__main__":
    print_user_columns()
