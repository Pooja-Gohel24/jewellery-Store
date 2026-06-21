"""initial_schema

Revision ID: adbf78f424f6
Revises: 
Create Date: 2026-06-21 19:05:14.971538

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, text


revision: str = 'adbf78f424f6'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(conn, table_name: str) -> bool:
    return inspect(conn).has_table(table_name)


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    cols = [c["name"] for c in inspect(conn).get_columns(table_name)]
    return column_name in cols


def _index_exists(conn, index_name: str) -> bool:
    result = conn.execute(
        text("SELECT 1 FROM pg_indexes WHERE indexname = :idx"),
        {"idx": index_name}
    )
    return result.fetchone() is not None


def upgrade() -> None:
    conn = op.get_bind()

    # ── otps ────────────────────────────────────────────────────────────
    if not _table_exists(conn, "otps"):
        op.create_table(
            "otps",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("email", sa.String(), nullable=False),
            sa.Column("otp", sa.String(), nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
    if not _index_exists(conn, "ix_otps_id"):
        op.create_index("ix_otps_id", "otps", ["id"], unique=False)
    if not _index_exists(conn, "ix_otps_email"):
        op.create_index("ix_otps_email", "otps", ["email"], unique=False)

    # ── orders ──────────────────────────────────────────────────────────
    if not _table_exists(conn, "orders"):
        op.create_table(
            "orders",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(), nullable=True),
            sa.Column("total_amount", sa.Float(), nullable=False),
            sa.Column("shipping_amount", sa.Float(), nullable=True),
            sa.Column("tax_amount", sa.Float(), nullable=True),
            sa.Column("payment_method", sa.String(), nullable=True),
            sa.Column("full_name", sa.String(), nullable=False),
            sa.Column("email", sa.String(), nullable=False),
            sa.Column("phone", sa.String(), nullable=False),
            sa.Column("address", sa.Text(), nullable=False),
            sa.Column("city", sa.String(), nullable=False),
            sa.Column("state", sa.String(), nullable=False),
            sa.Column("pincode", sa.String(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
    if not _index_exists(conn, "ix_orders_id"):
        op.create_index("ix_orders_id", "orders", ["id"], unique=False)
    if not _index_exists(conn, "ix_orders_user_id"):
        op.create_index("ix_orders_user_id", "orders", ["user_id"], unique=False)

    # ── order_items ──────────────────────────────────────────────────────
    if not _table_exists(conn, "order_items"):
        op.create_table(
            "order_items",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("order_id", sa.Integer(), nullable=False),
            sa.Column("product_id", sa.Integer(), nullable=True),
            sa.Column("product_name", sa.String(), nullable=False),
            sa.Column("product_img", sa.String(), nullable=True),
            sa.Column("price", sa.Float(), nullable=False),
            sa.Column("quantity", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )
    if not _index_exists(conn, "ix_order_items_id"):
        op.create_index("ix_order_items_id", "order_items", ["id"], unique=False)

    # ── products.stock ───────────────────────────────────────────────────
    if not _column_exists(conn, "products", "stock"):
        op.add_column("products", sa.Column("stock", sa.Integer(), nullable=True))
        conn.execute(text("UPDATE products SET stock = 100 WHERE stock IS NULL"))

    # ── users.is_admin ───────────────────────────────────────────────────
    if not _column_exists(conn, "users", "is_admin"):
        op.add_column("users", sa.Column("is_admin", sa.Boolean(), nullable=True))
        conn.execute(text("UPDATE users SET is_admin = FALSE WHERE is_admin IS NULL"))


def downgrade() -> None:
    conn = op.get_bind()
    if _column_exists(conn, "users", "is_admin"):
        op.drop_column("users", "is_admin")
    if _column_exists(conn, "products", "stock"):
        op.drop_column("products", "stock")
    if _table_exists(conn, "order_items"):
        op.drop_index("ix_order_items_id", table_name="order_items")
        op.drop_table("order_items")
    if _table_exists(conn, "orders"):
        op.drop_index("ix_orders_user_id", table_name="orders")
        op.drop_index("ix_orders_id", table_name="orders")
        op.drop_table("orders")
    if _table_exists(conn, "otps"):
        op.drop_index("ix_otps_id", table_name="otps")
        op.drop_index("ix_otps_email", table_name="otps")
        op.drop_table("otps")
