"""Add board sharing association table

Revision ID: fe711c5c81b9
Revises: 
Create Date: 2024-11-17 13:41:14.727507

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fe711c5c81b9'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('board_user_association',
    sa.Column('board_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['board_id'], ['boards.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], )
    )
    op.drop_table('board_shares')
    op.alter_column('boards', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.create_index(op.f('ix_boards_id'), 'boards', ['id'], unique=False)
    op.create_index(op.f('ix_boards_title'), 'boards', ['title'], unique=False)
    op.alter_column('lists', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.create_index(op.f('ix_lists_id'), 'lists', ['id'], unique=False)
    op.create_index(op.f('ix_lists_title'), 'lists', ['title'], unique=False)
    op.alter_column('tasks', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('tasks', 'description',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=True)
    op.create_index(op.f('ix_tasks_id'), 'tasks', ['id'], unique=False)
    op.create_index(op.f('ix_tasks_title'), 'tasks', ['title'], unique=False)
    op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=True))
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.drop_constraint('users_email_key', 'users', type_='unique')
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.drop_column('users', 'password_hash')
    op.drop_column('users', 'is_confirmed')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('is_confirmed', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('password_hash', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.create_unique_constraint('users_email_key', 'users', ['email'])
    op.alter_column('users', 'email',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'hashed_password')
    op.drop_index(op.f('ix_tasks_title'), table_name='tasks')
    op.drop_index(op.f('ix_tasks_id'), table_name='tasks')
    op.alter_column('tasks', 'description',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=True)
    op.alter_column('tasks', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.drop_index(op.f('ix_lists_title'), table_name='lists')
    op.drop_index(op.f('ix_lists_id'), table_name='lists')
    op.alter_column('lists', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.drop_index(op.f('ix_boards_title'), table_name='boards')
    op.drop_index(op.f('ix_boards_id'), table_name='boards')
    op.alter_column('boards', 'title',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.create_table('board_shares',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('board_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['board_id'], ['boards.id'], name='board_shares_board_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='board_shares_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='board_shares_pkey'),
    sa.UniqueConstraint('board_id', 'user_id', name='board_shares_board_id_user_id_key')
    )
    op.drop_table('board_user_association')
    # ### end Alembic commands ###
