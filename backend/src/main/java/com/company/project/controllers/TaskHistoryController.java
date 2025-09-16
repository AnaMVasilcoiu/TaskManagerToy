package com.company.project.controllers;

import com.company.project.entity.TaskHistory;
import com.company.project.repository.TaskHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/taskHistory")
public class TaskHistoryController {
    @Autowired
    private TaskHistoryRepository repository;

    // Get all history
    @GetMapping()
    public List<TaskHistory> getAllTasks() {
        return repository.findAll();
    }
}
