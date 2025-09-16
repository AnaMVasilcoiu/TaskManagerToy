CREATE TABLE Tasks (
   Id INT PRIMARY KEY AUTO_INCREMENT,
   Title VARCHAR(255) NOT NULL,
   Description VARCHAR(500),
   Status VARCHAR(20) NOT NULL
);

INSERT INTO Tasks (Title, Description, Status) VALUES
    ('Buy groceries', 'Milk, eggs, bread, and fruits', 'OPEN');

INSERT INTO Tasks (Title, Description, Status) VALUES
    ('Finish project report', 'Complete the final draft of the report', 'IN_PROGRESS');

INSERT INTO Tasks (Title, Description, Status) VALUES
    ('Workout', 'Go for a 30-minute run', 'OPEN');

INSERT INTO Tasks (Title, Description, Status) VALUES
    ('Call plumber', 'Fix the kitchen sink leak', 'DONE');

INSERT INTO Tasks (Title, Description, Status) VALUES
    ('Read book', 'Read 50 pages of "Clean Code"', 'IN_PROGRESS');

CREATE TABLE Task_history (
      Id INT AUTO_INCREMENT PRIMARY KEY,
      Task_id INT NOT NULL,
      Title VARCHAR(255),
      Description VARCHAR(255),
      Status VARCHAR(50),
      Action VARCHAR(50) NOT NULL,
      Timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
