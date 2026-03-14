package com.spendsense.service;

import com.spendsense.dto.ExpenseRequest;
import com.spendsense.dto.ExpenseResponse;

import java.util.List;
import java.util.Map;

public interface ExpenseService {
    ExpenseResponse addExpense(ExpenseRequest request, String userEmail);
    ExpenseResponse updateExpense(Long id, ExpenseRequest request, String userEmail);
    void deleteExpense(Long id, String userEmail);
    List<ExpenseResponse> getAllExpenses(String userEmail);
    List<ExpenseResponse> getExpensesByCategoryName(String categoryName, String userEmail);
    Map<String, Object> getMonthlySummary(int year, int month, String userEmail);
}
