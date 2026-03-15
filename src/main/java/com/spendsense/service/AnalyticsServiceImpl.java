package com.spendsense.service;

import com.spendsense.exception.ResourceNotFoundException;
import com.spendsense.model.User;
import com.spendsense.repository.ExpenseRepository;
import com.spendsense.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.spendsense.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public List<Map<String, Object>> getCategorySummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        return expenseRepository.getTotalExpensesByCategory(user.getId());
    }

    @Override
    public List<Map<String, Object>> getMonthlySummary(String userEmail) {
        User user = getUserByEmail(userEmail);
        return expenseRepository.getTotalExpensesByMonth(user.getId());
    }
}
