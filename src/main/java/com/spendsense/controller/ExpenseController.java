package com.spendsense.controller;

import com.spendsense.dto.ExpenseRequest;
import com.spendsense.dto.ExpenseResponse;
import com.spendsense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // JWT filter sets email as the username
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@Valid @RequestBody ExpenseRequest expenseRequest) {
        String email = getAuthenticatedUserEmail();
        ExpenseResponse response = expenseService.addExpense(expenseRequest, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable("id") Long id, @Valid @RequestBody ExpenseRequest expenseRequest) {
        String email = getAuthenticatedUserEmail();
        ExpenseResponse response = expenseService.updateExpense(id, expenseRequest, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable("id") Long id) {
        String email = getAuthenticatedUserEmail();
        expenseService.deleteExpense(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        String email = getAuthenticatedUserEmail();
        List<ExpenseResponse> expenses = expenseService.getAllExpenses(email);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCategory(@PathVariable("categoryName") String categoryName) {
        String email = getAuthenticatedUserEmail();
        List<ExpenseResponse> expenses = expenseService.getExpensesByCategoryName(categoryName, email);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(@RequestParam int year, @RequestParam int month) {
        String email = getAuthenticatedUserEmail();
        Map<String, Object> summary = expenseService.getMonthlySummary(year, month, email);
        return ResponseEntity.ok(summary);
    }
}
