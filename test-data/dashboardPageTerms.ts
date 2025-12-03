export const dashboardPageTerms = {
    // Income transactions
    incomeTransaction1: {
        type: 'Дохід',
        amount: '15000',
        category: 'Інвестиції',
        description: 'Продаж акцій',
        date: '2025-12-02',
        account: 'Картка ПриватБанку'
    },
    incomeTransaction2: {
        type: 'Дохід',
        amount: '5000',
        category: 'Фриланс',
        description: 'Проект',
        date: '2025-12-02',
        account: 'Картка ПриватБанку'
    },
    
    // Expense transactions
    expenseTransaction1: {
        type: 'Витрата',
        amount: '500',
        category: 'Транспорт',
        description: 'Таксі',
        date: '2025-12-01',
        account: 'Картка Монобанку'
    },
    expenseTransaction2: {
        type: 'Витрата',
        amount: '12500',
        category: 'Продукти',
        description: 'Покупка продуктів',
        date: '2025-12-01',
        account: 'Картка Монобанку'
    },
    expenseTransaction3: {
        type: 'Витрата',
        amount: '5000',
        category: 'Продукти',
        description: 'Покупка продуктів',
        date: '2025-12-01',
        account: 'Картка Монобанку'
    },
    
    // Expected values
    expectedTotalIncome: '20000.00 UAH',
    expectedTotalExpenses: '13000.00 UAH',
    expectedBalance: '10000.00 UAH'
} as const
