
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
        let response = await fetch("/api/workshops", options);
        let data = await response.json();
        return data;
    }

    async readOne(workshop_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/workshops/${workshop_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(workshop) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(workshop)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/workshops`, options);
        let data = await response.json();
        return data;
    }

    async add_product(workshop_id, product_id) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/products_in_workshops/${workshop_id}/${product_id}`, options);
        let data = await response.json();
        return data;
    }

    async delete_product(workshop_id, product_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/products_in_workshops/${workshop_id}/${product_id}`, options);
        let data = await response.json();
        return data;
    }

    async update(workshop) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(workshop)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/workshops`, options);
        let data = await response.json();
        return data;
    }

    async delete(workshop_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/workshops/${workshop_id}`, options);
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
        this.DELETING_PRODUCT = 2;
        this.table = document.querySelector(".workshops table");
        this.error = document.querySelector(".error");
        this.workshop_id = document.getElementById("workshop_id");
        this.workshop_name = document.getElementById("workshop_name");
        this.chief_initials = document.getElementById("chief_initials");
        this.telephone = document.getElementById("telephone");
        this.new_product = document.getElementById("new_product");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
        this.addProductButton = document.getElementById("add_product");
        this.product_id = document.getElementById("product_id");
        this.product_name = document.getElementById("product_name");
        this.deleteProductButton = document.getElementById("delete_product");
    }

    reset() {
        this.workshop_id.textContent = "";
        this.workshop_name.value = "";
        this.chief_initials.value = "";
        this.telephone.value = "";
        this.new_product.value = "";
        this.product_id.textContent = "";
        this.product_name.textContent = "";
        this.workshop_name.focus();
    }

    updateEditor(workshop) {
        this.workshop_id.textContent = workshop.workshop_id;
        this.workshop_name.value = workshop.workshop_name;
        this.chief_initials.value = workshop.chief_initials;
        this.telephone.value = workshop.telephone;
        this.new_product.value = "";
        this.product_id.textContent = "";
        this.product_name.textContent = "";
        this.workshop_name.focus();
    }

    updateEditorToDeleteProduct(product_name, product_id, workshop_id) {
        this.workshop_id.textContent = workshop_id;
        this.product_id.textContent = product_id;
        this.product_name.textContent = product_name;
        this.product_name.focus();
    }

    setButtonState(state) {
        if (state === this.NEW_NOTE) {
            this.createButton.disabled = false;
            this.updateButton.disabled = true;
            this.deleteButton.disabled = true;
            this.new_product.disabled = true;
            this.addProductButton.disabled = true;
            this.deleteProductButton.disabled = true;
        } else if (state === this.EXISTING_NOTE) {
            this.createButton.disabled = true;
            this.updateButton.disabled = false;
            this.deleteButton.disabled = false;
            this.new_product.disabled = false;
            this.addProductButton.disabled = false;
            this.deleteProductButton.disabled = true;
        } else if (state === this.DELETING_PRODUCT) {
            this.createButton.disabled = true;
            this.updateButton.disabled = true;
            this.deleteButton.disabled = true;
            this.new_product.disabled = true;
            this.addProductButton.disabled = true;
            this.deleteProductButton.disabled = false;
        }
    }

    buildTable(workshops) {
        let tbody,
            html = "";

        // Iterate over the workshops and build the table
        workshops.forEach((workshop) => {
            html += `
            <tr class="toEdit" data-workshop_id="${workshop.workshop_id}" data-workshop_name="${workshop.workshop_name}" data-chief_initials="${workshop.chief_initials}" data-telephone="${workshop.telephone}" data-products="${workshop.products}">
                <td rowspan="${workshop.products.length+1}" class="workshop_name">${workshop.workshop_name}</td>
                <td rowspan="${workshop.products.length+1}" class="chief_initials">${workshop.chief_initials}</td>
                <td rowspan="${workshop.products.length+1}" class="telephone">${workshop.telephone}</td>
                <td><b>add</b></td>
            </tr>`;
                workshop.products.forEach((product)=>{html +=`<tr class="toDeleteProduct" data-workshop_id="${workshop.workshop_id}" data-product_id="${product.product_id}" data-product_name="${product.product_name}">
                    <td id="${workshop.workshop_id}_${product.product_id}">${product.product_name} ID:${product.product_id}</td></tr>`});
                html +=`
            `;
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
        this.initializeAddProductEvent();
        this.initializeDeleteEvent();
        this.initializeResetEvent();
        this.initializeDeleteProductEvent();
    }

    async initializeTable() {
        try {
            let urlworkshop_id = +document.getElementById("url_workshop_id").value,
                workshops = await this.model.read();

            this.view.buildTable(workshops);

            // Did we navigate here with a workshop selected?
            if (urlworkshop_id) {
                let workshop = await this.model.readOne(urlworkshop_id);
                this.view.updateEditor(workshop);
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
        document.querySelector("table tbody").addEventListener("dblclick", (evt) => {
            let target = evt.target,
                parent = target.parentElement;

            evt.preventDefault();

            // Is this the name td?
            if (target) {
                let workshop_id = parent.getAttribute("data-workshop_id");

                window.location = `/products_in_workshops/${workshop_id}/{product_id}`;
            }
        });
        var closeIcons = document.getElementsByClassName('toEdit');
        var i = closeIcons.length;
        while (i--)
          closeIcons[i].addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                workshop_id = target.getAttribute("data-workshop_id"),
                workshop_name = target.getAttribute("data-workshop_name"),
                chief_initials = target.getAttribute("data-chief_initials"),
                telephone = target.getAttribute("data-telephone");

            this.view.updateEditor({
                workshop_id: workshop_id,
                workshop_name: workshop_name,
                chief_initials: chief_initials,
                telephone: telephone
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
        var closeIcons2 = document.getElementsByClassName('toDeleteProduct');
        i = closeIcons2.length;
        while (i--)
          closeIcons2[i].addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                workshop_id = target.getAttribute("data-workshop_id"),
                product_name = target.getAttribute("data-product_name"),
                product_id = target.getAttribute("data-product_id");

            this.view.reset();
            this.view.updateEditorToDeleteProduct(product_name, product_id, workshop_id);
            this.view.setButtonState(this.view.DELETING_PRODUCT);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let workshop_name = document.getElementById("workshop_name").value,
                chief_initials = document.getElementById("chief_initials").value,
                telephone = document.getElementById("telephone").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    workshop_id: 0,
                    workshop_name: workshop_name,
                    chief_initials: chief_initials,
                    telephone: telephone
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeAddProductEvent() {
        document.getElementById("add_product").addEventListener("click", async (evt) => {
            let workshop_id = +document.getElementById("workshop_id").textContent,
                new_product_id = document.getElementById("new_product").value;

            evt.preventDefault();
            try {
                await this.model.add_product(workshop_id, new_product_id);
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteProductEvent() {
        document.getElementById("delete_product").addEventListener("click", async (evt) => {
            let workshop_id = +document.getElementById("workshop_id").textContent,
                new_product_id = +document.getElementById("product_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete_product(workshop_id, new_product_id);
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let workshop_id = +document.getElementById("workshop_id").textContent,
                workshop_name = document.getElementById("workshop_name").value,
                chief_initials = document.getElementById("chief_initials").value,
                telephone = document.getElementById("telephone").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    workshop_id: workshop_id,
                    workshop_name: workshop_name,
                    chief_initials: chief_initials,
                    telephone: telephone
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let workshop_id = +document.getElementById("workshop_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(workshop_id);
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
