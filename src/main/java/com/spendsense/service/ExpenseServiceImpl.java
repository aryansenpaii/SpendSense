package com.spendsense.service;

import com.spendsense.dto.ExpenseRequest;
import com.spendsense.dto.ExpenseResponse;
import com.spendsense.exception.ResourceNotFoundException;
import com.spendsense.model.Category;
import com.spendsense.model.Expense;
import com.spendsense.model.User;
import com.spendsense.repository.CategoryRepository;
import com.spendsense.repository.ExpenseRepository;
import com.spendsense.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .date(expense.getDate())
                .categoryId(expense.getCategory().getId())
                .categoryName(expense.getCategory().getName())
                .build();
    }

    @Override
    public ExpenseResponse addExpense(ExpenseRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Expense expense = Expense.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .category(category)
                .user(user)
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return mapToResponse(savedExpense);
    }

    @Override
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this expense");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setCategory(category);

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToResponse(updatedExpense);
    }

    @Override
    public void deleteExpense(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this expense");
        }

        expenseRepository.delete(expense);
    }

    @Override
    public List<ExpenseResponse> getAllExpenses(String userEmail) {
        User user = getUserByEmail(userEmail);
        return expenseRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpenseResponse> getExpensesByCategoryName(String categoryName, String userEmail) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryName));

        return expenseRepository.findByUserIdAndCategoryId(user.getId(), category.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getMonthlySummary(int year, int month, String userEmail) {
        User user = getUserByEmail(userEmail);
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Expense> monthlyExpenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate);

        BigDecimal totalAmount = monthlyExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryBreakdown = monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().getName(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));

        Map<String, Object> summary = new HashMap<>();
        summary.put("year", year);
        summary.put("month", month);
        summary.put("totalExpenses", monthlyExpenses.size());
        summary.put("totalAmount", totalAmount);
        summary.put("categoryBreakdown", categoryBreakdown);

        return summary;
    }
}
