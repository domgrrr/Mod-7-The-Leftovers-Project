"""create containers table

Revision ID: e5c899f36f9c
Revises: ffdc0a98111c
Create Date: 2024-12-19 16:30:37.706503

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5c899f36f9c'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('containers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('storage_type', sa.String(length=12), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('containers')
    # ### end Alembic commands ###
