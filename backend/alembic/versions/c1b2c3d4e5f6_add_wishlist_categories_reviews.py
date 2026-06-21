"""add_wishlist_categories_reviews

Revision ID: c1b2c3d4e5f6
Revises: adbf78f424f6
Create Date: 2026-06-22 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, text

# revision identifiers, used by Alembic.
revision: str = 'c1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'adbf78f424f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(conn, table_name: str) -> bool:
    return inspect(conn).has_table(table_name)


def upgrade() -> None:
    conn = op.get_bind()

    # ── categories ──────────────────────────────────────────────────────
    if not _table_exists(conn, "categories"):
        op.create_table(
            "categories",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_categories_id", "categories", ["id"], unique=False)
        op.create_index("ix_categories_name", "categories", ["name"], unique=True)

        # Seed initial categories
        conn.execute(
            text(
                "INSERT INTO categories (name) VALUES ('Rings'), ('Necklaces'), ('Earrings'), ('Bracelets'), ('Watches') ON CONFLICT DO NOTHING"
            )
        )

    # ── wishlist_items ──────────────────────────────────────────────────
    if not _table_exists(conn, "wishlist_items"):
        op.create_table(
            "wishlist_items",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_wishlist_items_id", "wishlist_items", ["id"], unique=False)
        op.create_index("ix_wishlist_items_user_id", "wishlist_items", ["user_id"], unique=False)

    # ── reviews ──────────────────────────────────────────────────────────
    if not _table_exists(conn, "reviews"):
        op.create_table(
            "reviews",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=False),
            sa.Column("rating", sa.Integer(), nullable=False),
            sa.Column("comment", sa.String(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_reviews_id", "reviews", ["id"], unique=False)
        op.create_index("ix_reviews_product_id", "reviews", ["product_id"], unique=False)


def downgrade() -> None:
    conn = op.get_bind()
    if _table_exists(conn, "reviews"):
        op.drop_index("ix_reviews_product_id", table_name="reviews")
        op.drop_index("ix_reviews_id", table_name="reviews")
        op.drop_table("reviews")
    if _table_exists(conn, "wishlist_items"):
        op.drop_index("ix_wishlist_items_user_id", table_name="wishlist_items")
        op.drop_index("ix_wishlist_items_id", table_name="wishlist_items")
        op.drop_table("wishlist_items")
    if _table_exists(conn, "categories"):
        op.drop_index("ix_categories_name", table_name="categories")
        op.drop_index("ix_categories_id", table_name="categories")
        op.drop_table("categories")
