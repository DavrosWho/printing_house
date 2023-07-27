# models.py

from config import db, ma
from marshmallow_sqlalchemy import fields
from marshmallow import INCLUDE

workshop_to_product = db.Table('workshop_to_product',
                       db.Column('workshop_id',db.Integer,db.ForeignKey('workshops.workshop_id'),primary_key=True),
                       db.Column('product_id',db.Integer,db.ForeignKey('products.product_id'),primary_key=True))

class Product(db.Model):
    __tablename__ = "products"
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_code = db.Column(db.String(15))
    product_name = db.Column(db.String(20))
    price = db.Column(db.Integer)

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product
        load_instance = True
        sqla_session = db.session
        include_fk = True

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

class Workshop(db.Model):
    __tablename__ = "workshops"
    workshop_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workshop_name = db.Column(db.String(25))
    chief_initials = db.Column(db.String(50))
    telephone = db.Column(db.String(50))
    products = db.relationship(
        Product,
        secondary=workshop_to_product,
        backref=db.backref('workshops'),
        order_by="Product.product_name"
    )

class WorkshopSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Workshop
        load_instance = True
        sqla_session = db.session
        include_relationships = True
    products = fields.Nested(ProductSchema, default=[], many=True)

class Contract(db.Model):
    __tablename__ = "contracts"
    contract_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_name = db.Column(db.String(20))
    client_address = db.Column(db.String(30))
    registration_date = db.Column(db.Date)
    completion_date = db.Column(db.Date)

class ContractSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Contract
        load_instance = True
        sqla_session = db.session
        include_fk = True

class Order(db.Model):
    __tablename__ = "orders"
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.product_id"))
    contract_id = db.Column(db.Integer, db.ForeignKey("contracts.contract_id"))
    contract = db.relationship(Contract, backref=db.backref('orders'), uselist=False)
    product = db.relationship(Product, backref=db.backref('orders'), uselist=False)
    quantity = db.Column(db.Integer)

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True
        sqla_session = db.session
        include_relationships = True
        unknown = INCLUDE
    product = fields.Nested(ProductSchema)
    contract = fields.Nested(ContractSchema)
