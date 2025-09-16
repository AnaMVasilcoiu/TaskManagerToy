package com.company.project.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_history")
public class TaskHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer taskId; // reference to the task
    private String title;
    private String description;
    private String status;

    private String action; // CREATED, UPDATED, DELETED
    private LocalDateTime timestamp;

    public TaskHistory(){}

    public TaskHistory(String title, String description, String status, String action, LocalDateTime timestamp) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.action = action;
        this.timestamp = timestamp;
    }

    public Integer getId() {return id;}
    public void setId(int id) {this.id = id;}
    public Integer getTaskId() {return taskId;}
    public void setTaskId(int taskId) {this.taskId = taskId;}
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}
    public String getAction() {return action;}
    public void setAction(String action) {this.action = action;}
    public LocalDateTime getTimestamp() {return timestamp;}
    public void setTimestamp(LocalDateTime timestamp) {this.timestamp = timestamp;}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TaskHistory taskHistory = (TaskHistory) o;
        return title.equals(taskHistory.title);
    }
}
