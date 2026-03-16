package com.spendsense.service;

import com.spendsense.model.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category getCategoryByName(String name);
    Category addCategory(String name);
}
