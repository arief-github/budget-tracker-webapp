// handle everyyhing calculation budget
export default class BudgetTracker {
	constructor(querySelectorString) {
		this.root = document.querySelector(querySelectorString);
		// console.log(this.root);
		this.root.innerHTML = BudgetTracker.html();
		// handling when user click new entry button
		this.root
			.querySelector(".new-entry")
			.addEventListener("click", () => {
				this.onNewEntryBtnClick();
			});
		// load initial data from local storage
		this.load();
	}
	// return HTML for table itself
	static html() {
		return `
        <table class="budget-tracker">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="entries">
            </tbody>
            <tbody>
                <tr>
                    <td colspan="5">
                        <button type="button" class="btn-entry new-entry">New Entry</button>
                    </td>
                </tr>
            </tbody>
        <tfoot>
            <tr>
                <td colspan="5" class="summary">
                    <strong>Total : </strong>
                    <span class="total">Rp0</span>
                </td>
            </tr>
        </tfoot>
        </table>
        
        `;
	}

	// return HTML string single row inside table
	static entryHtml() {
		return `
                <tr>
                    <td><input type="date" class="input input-date"></td>
                    <td><input type="text" class="input input-description" placeholder="Add a description(e.g wages, bill, etc)"></td>
                    <td>
                    <select class="input input-type">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    </td>
                    <td>
                        <input type="number" class="input input-amount">
                    </td>
                    <td>
                        <button type="button" class="delete-entry">&#10005;</button>
                    </td>
                </tr>
        
        `;
	}

	// initial loading of the data
	load() {
		const entries = JSON.parse(
			localStorage.getItem("budget-tracker-entries") ||
				"[]"
		);

		// console.log(entries);

		for (const entry of entries) {
			this.addEntry(entry);
		}

		this.updateSummary();
	}

	// take all of current rows in the table and working total amount and display it to the bottom right corner
	updateSummary() {
		const total = this.getEntryRows().reduce((total, row) => {
			const amount =
				row.querySelector(
					".input-amount"
				).value;
			const isExpense =
				row.querySelector(".input-type")
					.value === "expense";
			const modifier = isExpense ? -1 : 1;
			return total + amount * modifier;
		}, 0);
		// console.log(total);

		const totalFormatted = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(total);

		this.root.querySelector(".total").textContent =
			totalFormatted;
	}

	// take all the data and save it all to the Local Storage
	save() {
		// console.log(this.getEntryRows());
		const data = this.getEntryRows().map((row) => {
			return {
				date: row.querySelector(".input-date")
					.value,
				description: row.querySelector(
					".input-description"
				).value,
				type: row.querySelector(".input-type")
					.value,
				amount: parseFloat(
					row.querySelector(
						".input-amount"
					).value
				),
			};
		});
		// console.log(data);
		localStorage.setItem(
			"budget-tracker-entries",
			JSON.stringify(data)
		);
		this.updateSummary();
	}

	// add new entry inside the table (use object)
	addEntry(entry = {}) {
		this.root
			.querySelector(".entries")
			.insertAdjacentHTML(
				"beforeend",
				BudgetTracker.entryHtml()
			);

		const row = this.root.querySelector(
			".entries tr:last-of-type"
		);
		row.querySelector(".input-date").value =
			entry.date ||
			new Date().toISOString().replace(/T.*/, "");
		row.querySelector(".input-description").value =
			entry.description || "";
		row.querySelector(".input-type").value =
			entry.type || "income";
		row.querySelector(".input-amount").value =
			entry.amount || 0;
		row.querySelector(".delete-entry").addEventListener(
			"click",
			(e) => {
				this.onDeleteEntryClickButton(e);
			}
		);
		row.querySelectorAll(".input").forEach((input) => {
			input.addEventListener("change", () =>
				this.save()
			);
		});
	}
	// return active rows of table entries
	getEntryRows() {
		return Array.from(
			this.root.querySelectorAll(".entries tr")
		);
	}

	// added new entry on click
	onNewEntryBtnClick() {
		this.addEntry();
	}

	// to do something with user when click X
	onDeleteEntryClickButton(e) {
		// console.log("Entry Deleted.");
		e.target.closest("tr").remove();
	}
}
