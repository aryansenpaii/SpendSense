package com.spendsense.controller;

import com.spendsense.dto.ExpenseRequest;
import com.spendsense.dto.ExpenseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@RequestBody ExpenseRequest expenseRequest) {
        // TODO: Implement add expense
        return ResponseEntity.ok(new ExpenseResponse());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest expenseRequest) {
        // TODO: Implement update expense
        return ResponseEntity.ok(new ExpenseResponse());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        // TODO: Implement delete expense
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        // TODO: Implement get all expenses
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByCategory(@RequestParam Long categoryId) {
        // TODO: Implement filter by category ID
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(@RequestParam int year, @RequestParam int month) {
        // TODO: Implement monthly summary
        return ResponseEntity.ok(Collections.emptyMap());
    }
}
