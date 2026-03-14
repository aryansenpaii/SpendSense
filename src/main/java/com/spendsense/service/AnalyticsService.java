package com.spendsense.service;

import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getCategorySummary(String userEmail);
    Map<String, Object> getMonthlySummary(String userEmail);
}
