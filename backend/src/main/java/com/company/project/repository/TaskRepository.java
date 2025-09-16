package com.company.project.repository;

import com.company.project.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    // Find by title containing (case-insensitive) and status (optional)
    List<Task> findByTitleContainingIgnoreCaseAndStatusIgnoreCase(String title, String status);

    // Overloads for optional parameters
    List<Task> findByTitleContainingIgnoreCase(String title);
    List<Task> findByStatusIgnoreCase(String status);
}