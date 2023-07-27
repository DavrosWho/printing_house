# app.py

from flask import render_template 
import config
from models import Product, Workshop

app = config.connex_app
app.add_api(config.basedir / "swagger.yml")

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/products")
@app.route("/products/<int:product_id>")
def products(product_id=""):
    """
    This function just responds to the browser URL
    localhost:5000/products

    :return:        the rendered template "products.html"
    """
    return render_template("products.html", product_id=product_id)

@app.route("/workshops")
@app.route("/workshops/<int:workshop_id>")
def workshops(workshop_id=""):
    return render_template("workshops.html", workshop_id=workshop_id)

@app.route("/contracts")
@app.route("/contracts/<int:contract_id>")
def contracts(contract_id=""):
    return render_template("contracts.html", contract_id=contract_id)

@app.route("/orders")
@app.route("/orders/<int:order_id>")
def orders(order_id=""):
    return render_template("orders.html", order_id=order_id)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)