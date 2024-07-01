import contextlib
import os

import psycopg2


@contextlib.contextmanager
def create_database():
    conn = psycopg2.connect(
        dbname=os.environ.get('CONFIG_DATABASE_NAME', 'eop_dev'),
        user=os.environ.get('CONFIG_DATABASE_USERNAME', 'eop_manager_app_user'),
        password=os.environ.get('CONFIG_DATABASE_PASSWORD', 'password'),
        host=os.environ.get('CONFIG_DATABASE_HOST', 'localhost'),
        port=os.environ.get('CONFIG_DATABASE_PORT',  "5432"),
    )

    cur = conn.cursor()

    yield cur, conn

    cur.close()
    conn.close()


def execute(query):
    with create_database() as (cur, conn):
        result = cur.execute(query)
        conn.commit()

    return result


def fetch(query):
    with create_database() as (cur, conn):
        cur.execute(query)
        result = cur.fetchall()

    return result
