package com.example.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import com.example.Entity.Exam;
import com.example.Entity.Exam.ExamStatus;

@Service
public class ExamSchedulerService {
    @Autowired
    private TaskScheduler taskScheduler;
    
    @Autowired
    private ExamServices examService;

    public void scheduleExam(Exam exam) {
         taskScheduler.schedule(() -> {
        	exam.setStatus(ExamStatus.Running);
        	examService.saveExam(exam);
            System.out.println("Exam started: " + exam.getExamName());
        }, java.sql.Timestamp.valueOf(exam.getExamStartDateTime()));
    }
}
