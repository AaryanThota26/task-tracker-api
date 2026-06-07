from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:@localhost:5432/taskdb"

engine = create_engine(DATABASE_URL)

connection = engine.connect()

print("Connected to PostgreSQL successfully!")