package com.spendsense.service;

import com.spendsense.exception.ResourceNotFoundException;
import com.spendsense.model.Category;
import com.spendsense.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + name));
    }

    @Override
    public Category addCategory(String name) {
        if (categoryRepository.existsByName(name)) {
            return categoryRepository.findByName(name).get();
        }
        Category category = Category.builder().name(name).build();
        return categoryRepository.save(category);
    }
}
