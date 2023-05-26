"""role and admin user creation

Revision ID: 057f56d965bc
Revises: d0f018e10ca5
Create Date: 2021-12-02 01:50:07.603750

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
from models.db import db
from models.UserModel import Role, User, UserRole

revision = '057f56d965bc'
down_revision = 'd0f018e10ca5'
branch_labels = None
depends_on = None


def upgrade():
    if db.session.query(Role).count() == 0:
        op.bulk_insert(Role.__table__, [
            {
                'id': 1, 'role': 'student',
            },
            {
                'id': 2, 'role': 'admin',
            },
            {
                'id': 3, 'role': 'adviser',
            }
        ])
        op.bulk_insert(User.__table__, [
            {
                'id': 1,
                'first_name': 'admin',
                'last_name': 'admin',
                'access_id': 'admin',
                'email': 'admin@mail.com',
                'password': '$2a$10$e5J8RBaLJ6nA2rI04simr.U8srlerfjn/4S1CSnZuyKcOKJTNbocy',
                'active': False
            },
        ])

        op.bulk_insert(UserRole.__table__, [
            {
                'id': 1,
                'user_id': 1,
                'role_id': 2,
                'active': True,
            },
        ])
