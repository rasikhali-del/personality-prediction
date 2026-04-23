"""
Database connection utilities for MySQL
"""
import mysql.connector
from decouple import config
import logging

logger = logging.getLogger(__name__)


class MySQLConnection:
    """MySQL database connection manager"""
    
    def __init__(self):
        self.host = config('DB_HOST', default='localhost')
        self.port = config('DB_PORT', default=3306, cast=int)
        self.database = config('DB_NAME', default='personality_prediction')
        self.user = config('DB_USER', default='root')
        self.password = config('DB_PASSWORD', default='')
        self.connection = None
    
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8mb4',
                use_unicode=True
            )
            logger.info(f"✅ Connected to MySQL database: {self.database}")
            return self.connection
        except mysql.connector.Error as err:
            logger.error(f"❌ Database connection error: {err}")
            raise
    
    def disconnect(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
    
    def execute_query(self, query, params=None):
        """Execute SELECT query"""
        cursor = self.connection.cursor(dictionary=True)
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            return cursor.fetchall()
        finally:
            cursor.close()
    
    def execute_update(self, query, params=None):
        """Execute INSERT/UPDATE/DELETE query"""
        cursor = self.connection.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.connection.commit()
            logger.info(f"Rows affected: {cursor.rowcount}")
            return cursor.rowcount
        except mysql.connector.Error as err:
            self.connection.rollback()
            logger.error(f"Query execution error: {err}")
            raise
        finally:
            cursor.close()
    
    @staticmethod
    def get_connection():
        """Get singleton connection instance"""
        db = MySQLConnection()
        db.connect()
        return db


# Global connection instance
_db_connection = None


def get_db():
    """Get database connection instance"""
    global _db_connection
    if _db_connection is None:
        _db_connection = MySQLConnection()
        _db_connection.connect()
    return _db_connection


def close_db():
    """Close database connection"""
    global _db_connection
    if _db_connection:
        _db_connection.disconnect()
        _db_connection = None
