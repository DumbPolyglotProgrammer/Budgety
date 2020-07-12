
// BudgetController
var BudgetController = (function () {

    var data = {
        total: {
            income: 0,
            expense: 0
        },
        entries: {
            income: [],
            expense: []
        }
    }

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

            return entry;
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

        getInput: function () {
            return {
                type: document.querySelector(DOMElements.inputType).value, // possible values can be 'income' or 'expense'
                description: document.querySelector(DOMElements.inputDescription).value,
                value: document.querySelector(DOMElements.inputValue).value
            };
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

        // Add the item to the budget controller
        var entry = budgetController.addEntry(input.type, input.description, input.value);

        // Add the item to the UI
        uiController.addEntry(input.type, entry);

        // Clear the fields
        // ...

        // Calculate and update budget
        // ...

        // Calculate and update percentages
        // ...

    }

    return {

        init: function () {
            //...
            setupEventListeners();
        }

    };

})(BudgetController, UIController);

Controller.init();
