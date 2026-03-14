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
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    Category.builder().name("FOOD").build(),
                    Category.builder().name("TRAVEL").build(),
                    Category.builder().name("BILLS").build(),
                    Category.builder().name("SHOPPING").build(),
                    Category.builder().name("ENTERTAINMENT").build()
            );
            categoryRepository.saveAll(categories);
            System.out.println("Seeded database with default categories.");
        }
    }
}
