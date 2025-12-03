export const transactionsPageTerms = {
    // Expense transaction
    expenseTransaction: {
        amount: '1000',
        category: 'Продукти',
        description: 'Вино',
        date: '2025-11-26',
        account: 'Картка Монобанку',
        tag: 'Алкоголь'
    },
    
    // Income transaction
    incomeTransaction: {
        amount: '1000000',
        category: 'Зарплата',
        description: 'Листопад',
        date: '2025-11-26',
        account: 'Готівка',
        tag: 'Зарплата'
    },
    
    // CRUD operations - initial transaction
    initialTransaction: {
        amount: '2000',
        category: 'Транспорт',
        description: 'Таксі до аеропорту',
        date: '2025-11-26',
        account: 'Картка Монобанку'
    },
    
    // CRUD operations - edited transaction
    editedTransaction: {
        amount: '2500',
        category: 'Транспорт',
        description: 'Таксі до аеропорту (оновлено)'
    }
} as const
