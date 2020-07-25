
// BudgetController
const BudgetController = (() => {

    const data = {
        total: {
            budget: 0,
            income: 0,
            expense: 0,
            expensePercentage: -1
        },
        entries: {
            income: [],
            expense: []
        }
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    }

    const updateBudget = () => {

        // sync total income
        let totalIncome = 0;
        data.entries.income.forEach(entry => {
            totalIncome += entry.value;
        });
        data.total.income = totalIncome;

        // sync total expense
        let totalExpense = 0;
        data.entries.expense.forEach(entry => {
            totalExpense += entry.value;
        });
        data.total.expense = totalExpense;

        // sync total budget
        data.total.budget = data.total.income - data.total.expense;

        // sync total expense percentage
        if (data.total.income > 0) {
            data.total.expensePercentage = Math.round((data.total.expense / data.total.income) * 100);
        } else {
            data.total.expensePercentage = -1;
        }

    };

    const updateExpensePercentages = () => {

        // sync total expense percentages
        if (data.total.income > 0) {
            data.entries.expense.forEach(entry => {
                entry.percentage = Math.round((entry.value / data.total.income) * 100);
            });
        }

    }

    return {

        addEntry: (type, description, value) => {
            let entry;

            let id = 0;
            if (data.entries[type].length > 0) {
                id = data.entries[type][data.entries[type].length - 1].id + 1;
            }

            switch (type) {
                case 'income':
                    entry = new Income(id, description, value);
                    break;
                case 'expense':
                    entry = new Expense(id, description, value);
                    break;
            }

            data.entries[type].push(entry);

            updateBudget();

            updateExpensePercentages();

            return entry;
        },

        deleteEntry: (type, id) => {

            data.entries[type].forEach((entry, index) => {
                if (entry.id === id) {
                    data.entries[type].splice(index, 1);
                }
            });

            updateBudget();

            updateExpensePercentages();

        },

        getBudget: () => {
            return data.total;
        },

        getExpensePercentages: () => {
            return data.entries.expense.map(entry => {
                return entry.percentage
            });
        }

    };

})();


// UIController
const UIController = (() => {

    const DOMElements = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    const HTMLElements = {
        income: '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
        expense: '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    };

    return {

        init: () => {

            document.querySelector(DOMElements.budgetLabel).textContent = 0;
            document.querySelector(DOMElements.incomeLabel).textContent = 0;
            document.querySelector(DOMElements.expensesLabel).textContent = 0;
            document.querySelector(DOMElements.percentageLabel).textContent = '---';

        },

        getInput: () => {
            return {
                type: document.querySelector(DOMElements.inputType).value, // possible values can be 'income' or 'expense'
                description: document.querySelector(DOMElements.inputDescription).value,
                value: document.querySelector(DOMElements.inputValue).value
            };
        },

        clearInput: () => {

            const inputElements = document.querySelectorAll(`${DOMElements.inputDescription},${DOMElements.inputValue}`);
            for (inputElement of inputElements) {
                inputElement.value = '';
            }

            inputElements[0].focus();

        },

        toggleInput: () => {

            const inputElements = document.querySelectorAll(`${DOMElements.inputType},${DOMElements.inputDescription},${DOMElements.inputValue}`);
            for (inputElement of inputElements) {
                inputElement.classList.toggle('red-focus');
            }
            document.querySelector(DOMElements.inputBtn).classList.toggle('red');

        },

        addEntry: (type, entry) => {
            let container, htmlElement;

            switch (type) {
                case 'income':
                    container = DOMElements.incomeContainer;
                    htmlElement = HTMLElements.income;
                    break;
                case 'expense':
                    container = DOMElements.expensesContainer;
                    htmlElement = HTMLElements.expense;
                    break;
            }

            htmlElement = htmlElement.replace('%id%', entry.id);
            htmlElement = htmlElement.replace('%description%', entry.description);
            htmlElement = htmlElement.replace('%value%', entry.value);

            document.querySelector(container).insertAdjacentHTML('beforeend', htmlElement);
        },

        deleteEntry: (htmlElementId) => {

            const element = document.getElementById(htmlElementId);
            element.parentNode.removeChild(element);

        },

        updateBudget: (budget) => {

            document.querySelector(DOMElements.budgetLabel).textContent = budget.budget;
            document.querySelector(DOMElements.incomeLabel).textContent = budget.income;
            document.querySelector(DOMElements.expensesLabel).textContent = budget.expense;

            if (budget.expensePercentage > 0) {
                document.querySelector(DOMElements.percentageLabel).textContent = `${budget.expensePercentage}%`;
            } else {
                document.querySelector(DOMElements.percentageLabel).textContent = '---';
            }

        },

        updateExpensePercentages: (percentages) => {

            const expensePercentageElements = document.querySelectorAll(DOMElements.expensesPercLabel)
            expensePercentageElements.forEach((expensePercentageElement, index) => {
                if (percentages[index] > 0) {
                    expensePercentageElement.textContent = `${percentages[index]}%`;
                } else {
                    expensePercentageElement.textContent = '---';
                }
            });

        },

        getDOMElements: () => {
            return DOMElements;
        }

    };

})();


// Global App Controller
const Controller = ((budgetController, uiController) => {

    const setupEventListeners = () => {

        const DOMElements = uiController.getDOMElements();

        document.querySelector(DOMElements.inputBtn).addEventListener('click', addEntry);

        document.addEventListener('keypress', event => {
            if (event.code === 'Enter') {
                addEntry();
            }
        });

        document.querySelector(DOMElements.container).addEventListener('click', event => {

            const itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

            const [type, id] = itemId.split('-');

            deleteEntry(type, parseInt(id));

        });

        document.querySelector(DOMElements.inputType).addEventListener('change', uiController.toggleInput);

    };

    const addEntry = () => {

        // Get the field input data
        const input = uiController.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // Add the item to the budget controller
            const entry = budgetController.addEntry(input.type, input.description, parseFloat(input.value));

            // Add the item to the UI
            uiController.addEntry(input.type, entry);

            // Clear the fields
            uiController.clearInput();

            // Update budget in the UI
            uiController.updateBudget(budgetController.getBudget());

            // Update expense percentages in the UI
            uiController.updateExpensePercentages(budgetController.getExpensePercentages());

        }

    };

    const deleteEntry = (type, id) => {

        // Delete the item from the budget controller
        budgetController.deleteEntry(type, id);

        // Delete the item from the UI
        uiController.deleteEntry(`${type}-${id}`);

        // Update budget in the UI
        uiController.updateBudget(budgetController.getBudget());

        // Update expense percentages in the UI
        uiController.updateExpensePercentages(budgetController.getExpensePercentages());

    };

    return {

        init: () => {
            uiController.init();
            setupEventListeners();
        }

    };

})(BudgetController, UIController);


Controller.init();
