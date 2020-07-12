
// BudgetController
var BudgetController = (function () {

    var data = {
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

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var updateBudget = function () {

        // sync total income
        var totalIncome = 0;
        data.entries.income.forEach(function (entry) {
            totalIncome += entry.value;
        });
        data.total.income = totalIncome;

        // sync total expense
        var totalExpense = 0;
        data.entries.expense.forEach(function (entry) {
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

    return {

        addEntry: function (type, description, value) {
            var entry;

            switch (type) {
                case 'income':
                    entry = new Income(0, description, value);
                    break;
                case 'expense':
                    entry = new Expense(0, description, value);
                    break;
            }

            data.entries[type].push(entry);

            updateBudget();

            return entry;
        },

        getBudget: function () {
            return data.total;
        }

    };

})();


// UIController
var UIController = (function () {

    var DOMElements = {
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
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var HTMLElements = {
        income: '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>',
        expense: '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    };

    return {

        init: function () {

            document.querySelector(DOMElements.budgetLabel).textContent = 0;
            document.querySelector(DOMElements.incomeLabel).textContent = 0;
            document.querySelector(DOMElements.expensesLabel).textContent = 0;
            document.querySelector(DOMElements.percentageLabel).textContent = '---';
            
        },

        getInput: function () {
            return {
                type: document.querySelector(DOMElements.inputType).value, // possible values can be 'income' or 'expense'
                description: document.querySelector(DOMElements.inputDescription).value,
                value: document.querySelector(DOMElements.inputValue).value
            };
        },

        clearInput: function () {

            var inputElements = document.querySelectorAll(DOMElements.inputDescription + ', ' + DOMElements.inputValue);
            for (inputElement of inputElements) {
                inputElement.value = '';
            }

            inputElements[0].focus();

        },

        addEntry: function (type, entry) {
            var container, htmlElement;

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

        updateBudget: function (budget) {

            document.querySelector(DOMElements.budgetLabel).textContent = budget.budget;
            document.querySelector(DOMElements.incomeLabel).textContent = budget.income;
            document.querySelector(DOMElements.expensesLabel).textContent = budget.expense;

            if (budget.expensePercentage > 0) {
                document.querySelector(DOMElements.percentageLabel).textContent = budget.expensePercentage + '%';
            } else {
                document.querySelector(DOMElements.percentageLabel).textContent = '---';
            }

        },

        getDOMElements: function () {
            return DOMElements;
        }

    };

})();


// Global App Controller
var Controller = (function (budgetController, uiController) {

    var setupEventListeners = function () {

        var DOMElements = uiController.getDOMElements();

        document.querySelector(DOMElements.inputBtn).addEventListener('click', addEntry);

        document.addEventListener('keypress', function (event) {
            if (event.code === 'Enter') {
                addEntry();
            }
        });

    };

    var addEntry = function () {

        // Get the field input data
        var input = uiController.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // Add the item to the budget controller
            var entry = budgetController.addEntry(input.type, input.description, parseFloat(input.value));

            // Add the item to the UI
            uiController.addEntry(input.type, entry);

            // Clear the fields
            uiController.clearInput();

            // Update budget in the UI
            uiController.updateBudget(budgetController.getBudget());

            // Calculate and update percentages
            // ...

        }

    };

    return {

        init: function () {

            uiController.init();

            setupEventListeners();

        }

    };

})(BudgetController, UIController);


Controller.init();
