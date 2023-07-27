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
        let response = await fetch("/api/contracts", options);
        let data = await response.json();
        return data;
    }

    async readOne(contract_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contracts/${contract_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(contract) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(contract)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contracts`, options);
        let data = await response.json();
        return data;
    }

    async update(contract) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(contract)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contracts`, options);
        let data = await response.json();
        return data;
    }

    async delete(contract_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/contracts/${contract_id}`, options);
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
        this.table = document.querySelector(".contracts table");
        this.error = document.querySelector(".error");
        this.contract_id = document.getElementById("contract_id");
        this.client_name = document.getElementById("client_name");
        this.client_address = document.getElementById("client_address");
        this.registration_date = document.getElementById("registration_date");
        this.completion_date = document.getElementById("completion_date");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.contract_id.textContent = "";
        this.client_name.value = "";
        this.client_address.value = "";
        this.registration_date.value = "2001-01-01";
        this.completion_date.value = "2001-01-01";
        this.client_name.focus();
    }

    updateEditor(contract) {
        this.contract_id.textContent = contract.contract_id;
        this.client_name.value = contract.client_name;
        this.client_address.value = contract.client_address;
        this.registration_date.value = contract.registration_date;
        this.completion_date.value = contract.completion_date;
        this.client_name.focus();
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

    buildTable(contracts) {
        let tbody,
            html = "";

        // Iterate over the contracts and build the table
        contracts.forEach((contract) => {
            html += `
            <tr data-contract_id="${contract.contract_id}" data-client_name="${contract.client_name}" data-client_address="${contract.client_address}" data-registration_date="${contract.registration_date}" data-completion_date="${contract.completion_date}">
                <td class="client_name">${contract.client_name}</td>
                <td class="client_address">${contract.client_address}</td>
                <td class="registration_date">${contract.registration_date}</td>
                <td class="completion_date">${contract.completion_date}</td>
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
            let urlcontract_id = +document.getElementById("url_contract_id").value,
                contracts = await this.model.read();

            this.view.buildTable(contracts);

            // Did we navigate here with a contract selected?
            if (urlcontract_id) {
                let contract = await this.model.readOne(urlcontract_id);
                this.view.updateEditor(contract);
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
                contract_id = target.getAttribute("data-contract_id"),
                client_name = target.getAttribute("data-client_name"),
                client_address = target.getAttribute("data-client_address"),
                registration_date = target.getAttribute("data-registration_date"),
                completion_date = target.getAttribute("data-completion_date");

            this.view.updateEditor({
                contract_id: contract_id,
                client_name: client_name,
                client_address: client_address,
                registration_date: registration_date,
                completion_date: completion_date
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let client_name = document.getElementById("client_name").value,
                client_address = document.getElementById("client_address").value,
                registration_date = document.getElementById("registration_date").value,
                completion_date = document.getElementById("completion_date").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    contract_id: 0,
                    client_name: client_name,
                    client_address: client_address,
                    registration_date: registration_date,
                    completion_date: completion_date
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let contract_id = +document.getElementById("contract_id").textContent,
                client_name = document.getElementById("client_name").value,
                client_address = document.getElementById("client_address").value,
                registration_date = document.getElementById("registration_date").value,
                completion_date = document.getElementById("completion_date").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    contract_id: contract_id,
                    client_name: client_name,
                    client_address: client_address,
                    registration_date: registration_date,
                    completion_date: completion_date
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let contract_id = +document.getElementById("contract_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(contract_id);
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
