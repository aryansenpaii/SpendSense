# SpendSense Project Documentation

SpendSense is a smart expense tracking system featuring a robust Spring Boot backend API and a modern React Native mobile application built with Expo.

## Technical Stack

### Backend (API)
- **Java 17**: Core programming language.
- **Spring Boot 3.2.4**: Application framework.
- **Spring Data JPA**: For database ORM.
- **Spring Security & JJWT**: Authentication and authorization.
- **MySQL**: Relational database for persistent storage.
- **Lombok**: To reduce boilerplate code.
- **Maven**: Build and dependency management.

### Mobile (App)
- **React Native (0.83.2)**: Mobile development framework.
- **Expo (55.0.6)**: Development platform and toolset.
- **React Navigation**: For screen navigation (Tabs and Stack).
- **Axios**: For HTTP requests to the backend.
- **Async Storage**: For local persistence (JWT and user data).
- **Context API**: For global state management (Authentication).

---

## Backend Documentation (`src/main/java/com/spendsense`)

### Controllers (`com.spendsense.controller`)

| File | Purpose | Key Methods |
| :--- | :--- | :--- |
| `AnalyticsController.java` | Handles analytics requests. | `getMonthlySummary()`, `getCategorySummary()` |
| `AuthController.java` | Manages user registration and login. | `registerUser()`, `authenticateUser()` |
| `CategoryController.java` | Manages expense categories. | `getAllCategories()`, `addCategory()` |
| `ExpenseController.java` | Core expense management. | `addExpense()`, `updateExpense()`, `deleteExpense()`, `getAllExpenses()`, `getExpensesByCategory()`, `getMonthlySummary()` |

### Services (`com.spendsense.service`)

| File | Purpose | Key Methods |
| :--- | :--- | :--- |
| `AnalyticsService.java` (Intf) | Analytics logic definition. | `getCategorySummary()`, `getMonthlySummary()` |
| `AnalyticsServiceImpl.java` | Implements analytics queries. | `getCategorySummary()`, `getMonthlySummary()` |
| `CategoryService.java` (Intf) | Category logic definition. | `getAllCategories()`, `getCategoryById()`, `getCategoryByName()`, `addCategory()` |
| `CategoryServiceImpl.java` | Implements category operations. | `getAllCategories()`, `getCategoryById()`, `getCategoryByName()`, `addCategory()` |
| `ExpenseService.java` (Intf) | Expense logic definition. | `addExpense()`, `updateExpense()`, `deleteExpense()`, `getAllExpenses()`, `getExpensesByCategoryName()`, `getMonthlySummary()` |
| `ExpenseServiceImpl.java` | Core business logic for expenses. | `addExpense()`, `updateExpense()`, `deleteExpense()`, `getAllExpenses()`, `getMonthlySummary()` |

### Models (`com.spendsense.model`)

| File | Purpose | Main Fields |
| :--- | :--- | :--- |
| `User.java` | Represents a system user. | `id`, `name`, `email`, `password`, `createdAt`, `expenses` |
| `Category.java` | Represents expense categories. | `id`, `name`, `expenses` |
| `Expense.java` | Represents an individual expense. | `id`, `amount`, `description`, `date`, `category`, `user` |

### Security (`com.spendsense.security`)
- **`JwtUtil.java`**: Utility for generating and validating JSON Web Tokens.
- **`JwtAuthenticationFilter.java`**: intercepts requests to validate JWT in the `Authorization` header.
- **`UserDetailsServiceImpl.java`**: Loads user-specific data during authentication.
- **`SecurityConfig.java`**: Configures HTTP security, CSRF, session management, and path permissions.

---

## Mobile Documentation (`mobile/src`)

### Services (`mobile/src/services`)

| File | Purpose | Key Methods |
| :--- | :--- | :--- |
| `authService.js` | Authentication API calls. | `register()`, `login()`, `logout()` |
| `expenseService.js` | Expense API calls. | `getAllExpenses()`, `addExpense()`, `updateExpense()`, `deleteExpense()`, `getExpensesByCategory()` |
| `categoryService.js` | Category API calls. | `getAllCategories()`, `addCategory()` |
| `analyticsService.js` | Analytics API calls. | `getMonthlySummary()`, `getCategorySummary()` |

### Screens (`mobile/src/screens`)

| File | Purpose | Key Features |
| :--- | :--- | :--- |
| `HomeScreen.js` | Main dashboard. | Displays total balance, recent expenses, delete functionality, and navigation to add/edit. |
| `AddExpenseScreen.js` | Create new expense. | Form for amount, description, date (via picker), and category (with ability to add new categories inline). |
| `EditExpenseScreen.js` | Modify existing expense. | Prefilled form for updating expense details. |
| `AnalyticsScreen.js` | Data visualization. | Shows expense distribution by category (with progress bars) and monthly breakdown. |
| `LoginScreen.js` | User login. | Email/Password form with error handling and navigation to register. |
| `RegisterScreen.js` | Account creation. | User details form for new accounts. |

### Global State & Navigation
- **`AuthContext.js`**: Manages the authentication state (`user`, `token`, `isAuthenticated`) across the app using React Context.
- **`AppNavigator.js`**: Defines the main navigation structure (Bottom Tabs for Home and Analytics, Stack for Add/Edit Expense).
- **`AuthNavigator.js`**: Defines the authentication flow (Login and Register screens).
- **`apiClient.js`**: Centralized Axios instance with base URL and interceptors for adding the JWT token to requests.

### Utilities
- **`storage.js`**: abstraction over `@react-native-async-storage/async-storage` for saving/retrieving tokens and user data.
