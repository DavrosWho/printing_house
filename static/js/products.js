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
        let response = await fetch("/api/products", options);
        let data = await response.json();
        return data;
    }

    async readOne(product_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/products/${product_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(product) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(product)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/products`, options);
        let data = await response.json();
        return data;
    }

    async update(product) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(product)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/products`, options);
        let data = await response.json();
        return data;
    }

    async delete(product_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/products/${product_id}`, options);
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
        this.table = document.querySelector(".products table");
        this.error = document.querySelector(".error");
        this.product_id = document.getElementById("product_id");
        this.product_code = document.getElementById("product_code");
        this.product_name = document.getElementById("product_name");
        this.price = document.getElementById("price");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.product_id.textContent = "";
        this.product_code.value = "";
        this.product_name.value = "";
        this.price.value = 0;
        this.product_code.focus();
    }

    updateEditor(product) {
        this.product_id.textContent = product.product_id;
        this.product_code.value = product.product_code;
        this.product_name.value = product.product_name;
        this.price.value = product.price;
        this.product_code.focus();
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

    buildTable(products) {
        let tbody,
            html = "";

        // Iterate over the products and build the table
        products.forEach((product) => {
            html += `
            <tr data-product_id="${product.product_id}" data-product_code="${product.product_code}" data-product_name="${product.product_name}" data-price="${product.price}">
                <td class="product_code">${product.product_code}</td>
                <td class="product_name">${product.product_name}</td>
                <td class="price">${product.price}</td>
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
            let urlproduct_id = +document.getElementById("url_product_id").value,
                products = await this.model.read();

            this.view.buildTable(products);

            // Did we navigate here with a product selected?
            if (urlproduct_id) {
                let product = await this.model.readOne(urlproduct_id);
                this.view.updateEditor(product);
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
        document.querySelector("table tbody").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                product_id = target.getAttribute("data-product_id"),
                product_code = target.getAttribute("data-product_code"),
                product_name = target.getAttribute("data-product_name"),
                price = target.getAttribute("data-price");

            this.view.updateEditor({
                product_id: product_id,
                product_code: product_code,
                product_name: product_name,
                price: price
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let product_code = document.getElementById("product_code").value,
                product_name = document.getElementById("product_name").value,
                price = parseInt(document.getElementById("price").value);

            evt.preventDefault();
            try {
                await this.model.create({
                    product_id: 0,
                    product_code: product_code,
                    product_name: product_name,
                    price: price
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let product_id = +document.getElementById("product_id").textContent,
                product_code = document.getElementById("product_code").value,
                product_name = document.getElementById("product_name").value,
                price = parseInt(document.getElementById("price").value);

            evt.preventDefault();
            try {
                await this.model.update({
                    product_id: product_id,
                    product_code: product_code,
                    product_name: product_name,
                    price: price
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let product_id = +document.getElementById("product_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(product_id);
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
