package com.spendsense.config;

import com.spendsense.model.Category;
import com.spendsense.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = Arrays.asList(
                "Food & Dining",
                "Shopping",
                "Transportation",
                "Entertainment",
                "Bills & Utilities",
                "Health & Fitness",
                "Travel",
                "Groceries",
                "Education",
                "Other"
            );

            defaultCategories.forEach(name -> {
                Category category = Category.builder().name(name).build();
                categoryRepository.save(category);
            });

            System.out.println("Default categories initialized.");
        }
    }
}
