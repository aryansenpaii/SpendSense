package com.spendsense.service;

import com.spendsense.exception.ResourceNotFoundException;
import com.spendsense.model.User;
import com.spendsense.repository.ExpenseRepository;
import com.spendsense.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public Map<String, Object> getCategorySummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Map<String, Object>> results = expenseRepository.getTotalExpensesByCategory(user.getId());

        Map<String, Object> summary = new LinkedHashMap<>();
        for (Map<String, Object> row : results) {
            String category = (String) row.get("categoryName");
            BigDecimal total = (BigDecimal) row.get("totalAmount");
            summary.put(category.toLowerCase(), total);
        }

        return summary;
    }

    @Override
    public Map<String, Object> getMonthlySummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Map<String, Object>> results = expenseRepository.getTotalExpensesByMonth(user.getId());

        Map<String, Object> summary = new LinkedHashMap<>();
        for (Map<String, Object> row : results) {
            Integer year = (Integer) row.get("year");
            Integer month = (Integer) row.get("month");
            BigDecimal total = (BigDecimal) row.get("totalAmount");
            
            String key = year + "-" + String.format("%02d", month);
            summary.put(key, total);
        }

        return summary;
    }
}
