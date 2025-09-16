package com.company.project.repository;

import com.company.project.entity.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Integer> {
    List<TaskHistory> findByTaskIdOrderByTimestampDesc(Integer taskId);
}
