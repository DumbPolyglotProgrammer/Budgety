
// BudgetController
var BudgetController = (function () {

    //...

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

    return {

        getInput: function () {
            return {
                type: document.querySelector(DOMElements.inputType).value, // possible values can be'inc' or 'exp' // hitanshu : make enum
                description: document.querySelector(DOMElements.inputDescription).value,
                value: document.querySelector(DOMElements.inputValue).value
            };
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

        //...

        ////////
        console.log(uiController.getInput());
        ////////

    }

    return {

        init: function () {
            //...
            setupEventListeners();
        }

    };

})(BudgetController, UIController);

Controller.init();
