import sqlite3

conn = sqlite3.connect("journal.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM journals")

rows = cursor.fetchall()

print(rows)