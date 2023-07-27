/**
 * This is the model class which provides access to the server REST API
 * @type {{}}
 */
class Model {
    async read() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/orders", options);
        let data = await response.json();
        return data;
    }

    async readContracts() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/contracts", options);
        let data = await response.json();
        return data;
    }

    async readProducts() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/products", options);
        let data = await response.json();
        return data;
    }

    async readOne(order_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/orders/${order_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(order) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(order)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/orders`, options);
        let data = await response.json();
        return data;
    }

    async update(order) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(order)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/orders`, options);
        let data = await response.json();
        return data;
    }

    async delete(order_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/orders/${order_id}`, options);
        return response;
    }
}


/**
 * This is the view class which provides access to the DOM
 */
class View {
    constructor() {
        this.NEW_NOTE = 0;
        this.EXISTING_NOTE = 1;
        this.table = document.querySelector(".orders table");
        this.tableContracts = document.querySelector(".contracts table");
        this.tableProducts = document.querySelector(".products table");
        this.error = document.querySelector(".error");
        this.order_id = document.getElementById("order_id");
        this.product_id = document.getElementById("product_id");
        this.contract_id = document.getElementById("contract_id");
        this.quantity = document.getElementById("quantity");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
        this.contracts = document.getElementById("contracts");
        this.products = document.getElementById("products");
    }

    reset() {
        this.order_id.textContent = "";
        this.product_id.textContent = "";
        this.contract_id.textContent = "";
        this.quantity.value = 0;
        this.quantity.focus();
    }

    updateEditor(order) {
        this.order_id.textContent = order.order_id;
        this.product_id.textContent = order.product_id;
        this.contract_id.textContent = order.contract_id;
        this.quantity.value = order.quantity;
        this.quantity.focus();
    }

    updateEditorContract(contract_id) {
        this.contract_id.textContent = contract_id;
    }

    updateEditorProduct(product_id) {
        this.product_id.textContent = product_id;
    }

    setButtonState(state) {
        if (state === this.NEW_NOTE) {
            this.createButton.disabled = false;
            this.updateButton.disabled = true;
            this.deleteButton.disabled = true;
        } else if (state === this.EXISTING_NOTE) {
            this.createButton.disabled = true;
            this.updateButton.disabled = false;
            this.deleteButton.disabled = false;
        }
    }

    buildTableContracts(contracts) {
        let tbody,
            html = "";

        // Iterate over the contracts and build the tableContracts
        contracts.forEach((contract) => {
            html += `
            <tr class="toSetContract" data-contract_id="${contract.contract_id}">
            <td>${contract.client_name}</td>
            </tr>`;
        });
        // Is there currently a tbody in the tableContracts?
        if (this.tableContracts.tBodies.length !== 0) {
            this.tableContracts.removeChild(this.tableContracts.getElementsByTagName("tbody")[0]);
        }
        // Update tbody with our new content
        tbody = this.tableContracts.createTBody();
        tbody.innerHTML = html;
    }

    buildTableProducts(products) {
        let tbody,
            html = "";

        // Iterate over the products and build the tableProducts
        products.forEach((product) => {
            html += `
            <tr class="toSetProduct" data-product_id="${product.product_id}">
            <td>${product.product_name}</td>
            </tr>`;
        });
        // Is there currently a tbody in the tableProducts?
        if (this.tableProducts.tBodies.length !== 0) {
            this.tableProducts.removeChild(this.tableProducts.getElementsByTagName("tbody")[0]);
        }
        // Update tbody with our new content
        tbody = this.tableProducts.createTBody();
        tbody.innerHTML = html;
    }

    buildTable(orders) {
        let tbody,
            html = "";

        // Iterate over the orders and build the table
        orders.forEach((order) => {
            html += `
            <tr data-order_id="${order.order_id}" data-product_id="${order.product.product_id}" data-contract_id="${order.contract.contract_id}" data-quantity="${order.quantity}">
                <td class="product_name">${order.product.product_name}</td>
                <td class="client_name">${order.contract.client_name}</td>
                <td class="quantity">${order.quantity}</td>
            </tr>`;
        });
        // Is there currently a tbody in the table?
        if (this.table.tBodies.length !== 0) {
            this.table.removeChild(this.table.getElementsByTagName("tbody")[0]);
        }
        // Update tbody with our new content
        tbody = this.table.createTBody();
        tbody.innerHTML = html;
    }

    errorMessage(message) {
        this.error.innerHTML = message;
        this.error.classList.add("visible");
        this.error.classList.remove("hidden");
        setTimeout(() => {
            this.error.classList.add("hidden");
            this.error.classList.remove("visible");
        }, 2000);
    }
}


/**
 * This is the controller class for the user interaction
 */
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initialize();
    }

    async initialize() {
        await this.initializeTable();
        this.initializeTableEvents();
        this.initializeCreateEvent();
        this.initializeUpdateEvent();
        this.initializeDeleteEvent();
        this.initializeResetEvent();
    }

    async initializeTable() {
        try {
            let urlorder_id = +document.getElementById("url_order_id").value,
                orders = await this.model.read(),
                contracts = await this.model.readContracts(),
                products = await this.model.readProducts();

            this.view.buildTable(orders);
            this.view.buildTableProducts(products);
            this.view.buildTableContracts(contracts);

            // Did we navigate here with a order selected?
            if (urlorder_id) {
                let order = await this.model.readOne(urlorder_id);
                this.view.updateEditor(order);
                this.view.setButtonState(this.view.EXISTING_NOTE);

            // Otherwise, nope, so leave the editor blank
            } else {
                this.view.reset();
                this.view.setButtonState(this.view.NEW_NOTE);
            }
            this.initializeTableEvents();
        } catch (err) {
            this.view.errorMessage(err);
        }
    }

    initializeTableEvents() {
        document.querySelector(".orders table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                order_id = target.getAttribute("data-order_id"),
                product_id = target.getAttribute("data-product_id"),
                contract_id = target.getAttribute("data-contract_id"),
                quantity = target.getAttribute("data-quantity");

            this.view.updateEditor({
                order_id: order_id,
                product_id: product_id,
                contract_id: contract_id,
                quantity: quantity
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
        document.querySelector(".contracts table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                contract_id = target.getAttribute("data-contract_id");

            this.view.updateEditorContract(contract_id);
        });
        document.querySelector(".products table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                product_id = target.getAttribute("data-product_id");

            this.view.updateEditorProduct(product_id);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let product_id = +document.getElementById("product_id").textContent,
                contract_id = +document.getElementById("contract_id").textContent,
                quantity = parseInt(document.getElementById("quantity").value);

            evt.preventDefault();
            try {
                await this.model.create({
                    order_id: 0,
                    product_id: product_id,
                    contract_id: contract_id,
                    quantity: quantity
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let order_id = +document.getElementById("order_id").textContent,
                product_id = +document.getElementById("product_id").textContent,
                contract_id = +document.getElementById("contract_id").textContent,
                quantity = parseInt(document.getElementById("quantity").value);

            evt.preventDefault();
            try {
                await this.model.update({
                    order_id: order_id,
                    product_id: product_id,
                    contract_id: contract_id,
                    quantity: quantity
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let order_id = +document.getElementById("order_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(order_id);
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeResetEvent() {
        document.getElementById("reset").addEventListener("click", async (evt) => {
            evt.preventDefault();
            this.view.reset();
            this.view.setButtonState(this.view.NEW_NOTE);
        });
    }
}

// Create the MVC components
const model = new Model();
const view = new View();
const controller = new Controller(model, view);

// export the MVC components as the default
export default {
    model,
    view,
    controller
};
