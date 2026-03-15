package com.spendsense.service;

import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    List<Map<String, Object>> getCategorySummary(String userEmail);
    List<Map<String, Object>> getMonthlySummary(String userEmail);
}
