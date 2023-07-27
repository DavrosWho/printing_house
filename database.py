# database.py
from marshmallow import EXCLUDE
from sqlalchemy.sql.expression import func
from flask import abort, make_response
from datetime import datetime
from config import db
from models import Product, ProductSchema, Workshop, WorkshopSchema, Contract, ContractSchema, Order, OrderSchema

def read_all_products():
    products = Product.query.all()
    products_schema = ProductSchema(many=True)
    return products_schema.dump(products)

def create_product(product):
    product_id = product.get("product_id")

    product2 = {
      "price": product.get("price"),
      "product_code": product.get("product_code"),
      "product_id": db.session.query(func.max(Product.product_id)).scalar() + 1,
      "product_name": product.get("product_name")
    }
    product_schema = ProductSchema()
    new_product = product_schema.load(product2, session=db.session)
    db.session.add(new_product)
    db.session.commit()
    return product_schema.dump(new_product), 201

def read_one_product(product_id):
    product = Product.query.filter(Product.product_id == product_id).one_or_none()

    if product is not None:
        product_schema = ProductSchema()
        return product_schema.dump(product)
    else:
        abort(
            404, f"Product with id {product_id} not found"
        )

def update_product(product):
    product_id = product.get("product_id")
    existing_product = Product.query.filter(Product.product_id == product_id).one_or_none()

    if existing_product:
        product_schema = ProductSchema()
        update_product = product_schema.load(product, session=db.session)
        existing_product.product_code = update_product.product_code
        existing_product.product_name = update_product.product_name
        existing_product.price = update_product.price
        db.session.merge(existing_product)
        db.session.commit()
        return product_schema.dump(existing_product), 201
    else:
        abort(
            404,
            f"Product with id {product_id} not found"
        )

def delete_product(product_id):
    existing_product = Product.query.filter(Product.product_id == product_id).one_or_none()

    if existing_product:
        db.session.delete(existing_product)
        db.session.commit()
        return make_response(f"Product with id {product_id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Product with id {product_id} not found"
        )

def read_all_workshops():
    workshops = Workshop.query.all()
    workshops_schema = WorkshopSchema(many=True)
    return workshops_schema.dump(workshops)

def create_workshop(workshop):
    workshop_id = workshop.get("workshop_id")

    workshop2 = {
      "chief_initials": workshop.get("chief_initials"),
      "telephone": workshop.get("telephone"),
      "workshop_id": db.session.query(func.max(Workshop.workshop_id)).scalar() + 1,
      "workshop_name": workshop.get("workshop_name"),
      #"products": workshop.get("products")
    }
    workshop_schema = WorkshopSchema()
    new_workshop = workshop_schema.load(workshop2, session=db.session)
    db.session.add(new_workshop)
    db.session.commit()
    return workshop_schema.dump(new_workshop), 201

def read_one_workshop(workshop_id):
    workshop = Workshop.query.filter(Workshop.workshop_id == workshop_id).one_or_none()

    if workshop is not None:
        workshop_schema = WorkshopSchema()
        return workshop_schema.dump(workshop)
    else:
        abort(
            404, f"Workshop with id {workshop_id} not found"
        )

def update_workshop(workshop):
    workshop_id = workshop.get("workshop_id")
    existing_workshop = Workshop.query.filter(Workshop.workshop_id == workshop_id).one_or_none()

    if existing_workshop:
        workshop_schema = WorkshopSchema()
        update_workshop = workshop_schema.load(workshop, session=db.session)
        existing_workshop.chief_initials = update_workshop.chief_initials
        existing_workshop.telephone = update_workshop.telephone
        existing_workshop.workshop_name = update_workshop.workshop_name
        #existing_workshop.products = update_workshop.products
        db.session.merge(existing_workshop)
        db.session.commit()
        return workshop_schema.dump(existing_workshop), 201
    else:
        abort(
            404,
            f"Workshop with id {workshop_id} not found"
        )

def delete_workshop(workshop_id):
    existing_workshop = Workshop.query.filter(Workshop.workshop_id == workshop_id).one_or_none()

    if existing_workshop:
        db.session.delete(existing_workshop)
        db.session.commit()
        return make_response(f"Workshop with id {workshop_id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Workshop with id {workshop_id} not found"
        ) 

def insert_product(workshop_id, product_id):
    workshop = Workshop.query.get(workshop_id)
    existing_product = Product.query.filter(Product.product_id == product_id).one_or_none()

    if workshop:
        if existing_product:
            product_schema = ProductSchema()
            workshop.products.append(existing_product)
            db.session.commit()
            return product_schema.dump(existing_product), 201
        else:
            abort(
                404,
                f"Product with id {product_id} not found"
            )
    else:
        abort(
            404,
            f"Workshop with id {workshop_id} not found"
        )

def extract_product(workshop_id, product_id):
    workshop = Workshop.query.get(workshop_id)
    existing_product = Product.query.filter(Product.product_id == product_id).one_or_none()

    if workshop:
        if existing_product:
            product_schema = ProductSchema()
            workshop.products.remove(existing_product)
            db.session.commit()
            return product_schema.dump(existing_product), 201
        else:
            abort(
                404,
                f"Product with id {product_id} not found"
            )
    else:
        abort(
            404,
            f"Workshop with id {workshop_id} not found"
        )

def read_all_contracts():
    contracts = Contract.query.all()
    contracts_schema = ContractSchema(many=True)
    return contracts_schema.dump(contracts)

def create_contract(contract):
    contract_id = contract.get("contract_id")

    contract2 = { 
      "client_name": contract.get("client_name"),
      "client_address": contract.get("client_address"),
      "contract_id": db.session.query(func.max(Contract.contract_id)).scalar() + 1,
      "registration_date": contract.get("registration_date"),
      "completion_date": contract.get("completion_date")
    }
    contract_schema = ContractSchema()
    new_contract = contract_schema.load(contract2, session=db.session)
    db.session.add(new_contract)
    db.session.commit()
    return contract_schema.dump(new_contract), 201

def read_one_contract(contract_id):
    contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if contract is not None:
        contract_schema = ContractSchema()
        return contract_schema.dump(contract)
    else:
        abort(
            404, f"Contract with id {contract_id} not found"
        )

def update_contract(contract):
    contract_id = contract.get("contract_id")
    existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if existing_contract:
        contract_schema = ContractSchema()
        update_contract = contract_schema.load(contract, session=db.session)
        existing_contract.client_name = update_contract.client_name
        existing_contract.client_address = update_contract.client_address
        existing_contract.registration_date = update_contract.registration_date
        existing_contract.completion_date = update_contract.completion_date
        db.session.merge(existing_contract)
        db.session.commit()
        return contract_schema.dump(existing_contract), 201
    else:
        abort(
            404,
            f"Contract with id {contract_id} not found"
        )

def delete_contract(contract_id):
    existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if existing_contract:
        db.session.delete(existing_contract)
        db.session.commit()
        return make_response(f"Contract with id {contract_id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Contract with id {contract_id} not found"
        )

def read_all_orders():
    orders = Order.query.all()
    orders_schema = OrderSchema(many=True)
    return orders_schema.dump(orders)

def create_order(order):
    order_id = order.get("order_id")
    product_id = order.get("product_id")
    contract_id = order.get("contract_id")
    existing_product = Product.query.filter(Product.product_id == product_id).one_or_none()
    existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if existing_contract is None:
        abort(
                404,
                f"Contract with id {contract_id} not found"
            )

    if existing_product is None:
        abort(
                404,
                f"Product with id {product_id} not found"
            )

    print(order.get("product_id"))
    print(order.get("contract_id"))

    order2 = {
      "product_id": existing_product.product_id,
      "contract_id":existing_contract.contract_id,
      "order_id": db.session.query(func.max(Order.order_id)).scalar() + 1,
      "quantity": order.get("quantity")
    }
    print(order2)
    order_schema = OrderSchema()
    print(order_schema)
    new_order = order_schema.load(order2, session=db.session)
    print(new_order)
    db.session.add(new_order)
    db.session.commit()
    return order_schema.dump(new_order), 201

def read_one_order(order_id):
    order = Order.query.filter(Order.order_id == order_id).one_or_none()

    if order is not None:
        order_schema = OrderSchema()
        return order_schema.dump(order)
    else:
        abort(
            404, f"Order with id {order_id} not found"
        )

def update_order(order):
    order_id = order.get("order_id")
    existing_order = Order.query.filter(Order.order_id == order_id).one_or_none()

    product_id = order.get("product_id")
    contract_id = order.get("contract_id")
    existing_product = Product.query.filter(Product.product_id == product_id).one_or_none()
    existing_contract = Contract.query.filter(Contract.contract_id == contract_id).one_or_none()

    if existing_contract is None:
        abort(
                404,
                f"Contract with id {contract_id} not found"
            )

    if existing_product is None:
        abort(
                404,
                f"Product with id {product_id} not found"
            )

    if existing_order:
        order_schema = OrderSchema()
        update_order = order_schema.load(order, session=db.session)
        existing_order.product_id = update_order.product_id
        existing_order.contract_id = update_order.contract_id
        existing_order.quantity = update_order.quantity
        db.session.merge(existing_order)
        db.session.commit()
        return order_schema.dump(existing_order), 201
    else:
        abort(
            404,
            f"Order with id {order_id} not found"
        )

def delete_order(order_id):
    existing_order = Order.query.filter(Order.order_id == order_id).one_or_none()

    if existing_order:
        db.session.delete(existing_order)
        db.session.commit()
        return make_response(f"Order with id {order_id} successfully deleted", 200)
    else:
        abort(
            404,
            f"Order with id {order_id} not found"
        )