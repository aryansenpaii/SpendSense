package com.spendsense.repository;

import com.spendsense.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdAndCategoryId(Long userId, Long categoryId);
    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT e.category.name as categoryName, SUM(e.amount) as totalAmount " +
           "FROM Expense e WHERE e.user.id = :userId GROUP BY e.category.name")
    List<Map<String, Object>> getTotalExpensesByCategory(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('YEAR', e.date) as year, FUNCTION('MONTH', e.date) as month, SUM(e.amount) as totalAmount " +
           "FROM Expense e WHERE e.user.id = :userId GROUP BY FUNCTION('YEAR', e.date), FUNCTION('MONTH', e.date) " +
           "ORDER BY year DESC, month DESC")
    List<Map<String, Object>> getTotalExpensesByMonth(@Param("userId") Long userId);
}
