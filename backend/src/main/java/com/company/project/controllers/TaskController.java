package com.company.project.controllers;

import com.company.project.entity.Task;
import com.company.project.entity.TaskHistory;
import com.company.project.repository.TaskHistoryRepository;
import com.company.project.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository repository;

    @Autowired
    private TaskHistoryRepository historyRepository;

    private void saveHistory(Task task, String action) {
        TaskHistory history = new TaskHistory();
        history.setTaskId(task.getId());
        history.setTitle(task.getTitle());
        history.setDescription(task.getDescription());
        history.setStatus(task.getStatus());
        history.setAction(action);
        history.setTimestamp(LocalDateTime.now());
        historyRepository.save(history);
    }

    // Get all tasks
    @GetMapping()
    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    // Filter tasks by status and/or title
    //    @GetMapping("/filter")
    //    public List<Task> filterTasks(
    //            @RequestParam(required = false) String title,
    //            @RequestParam(required = false) String status
    //    ) {
    //        return repository.findAll().stream()
    //                .filter(task -> title == null || task.getTitle().toLowerCase().contains(title.toLowerCase()))
    //                .filter(task -> status == null || task.getStatus().equalsIgnoreCase(status))
    //                .collect(Collectors.toList());
    //    }
    @GetMapping("/filter")
    public List<Task> filterTasks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status
    ) {
        if (title != null && status != null) {
            return repository.findByTitleContainingIgnoreCaseAndStatusIgnoreCase(title, status);
        } else if (title != null) {
            return repository.findByTitleContainingIgnoreCase(title);
        } else if (status != null) {
            return repository.findByStatusIgnoreCase(status);
        } else {
            return repository.findAll();
        }
    }


    // Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable int id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Task savedTask = repository.save(task);
        saveHistory(savedTask, "CREATED");
        return savedTask;
    }

    // Update an existing task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Task taskDetails) {
        return repository.findById(id).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setStatus(taskDetails.getStatus());
            Task updatedTask = repository.save(task);
            saveHistory(updatedTask, "UPDATED");
            return ResponseEntity.ok(updatedTask);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable int id) {
        return repository.findById(id).map(task -> {
            saveHistory(task, "DELETED");
            repository.delete(task);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/history")
    public List<TaskHistory> getTaskHistory(@PathVariable int id) {
        return historyRepository.findByTaskIdOrderByTimestampDesc(id);
    }
}
