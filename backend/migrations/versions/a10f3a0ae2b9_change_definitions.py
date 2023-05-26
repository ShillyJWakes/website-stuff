"""change definitions

Revision ID: a10f3a0ae2b9
Revises: 37dc0fd08481
Create Date: 2023-05-26 14:01:30.365139

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'a10f3a0ae2b9'
down_revision = '37dc0fd08481'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'secondary_email',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)
    op.create_unique_constraint(None, 'user', ['secondary_email'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='unique')
    op.alter_column('user', 'secondary_email',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
    # ### end Alembic commands ###
