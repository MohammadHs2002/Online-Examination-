package com.example.Entity;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Exam")
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer examId;

    @Column(name="exam_name",nullable = false)
    private String examName;
    
    @Column(nullable = false)
    private LocalDateTime examStartDateTime;

    @Column(nullable = false)
    private Integer examDuration;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExamType examType; 

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private com.example.Entity.Question.Difficulty examDifficulty;

    @ManyToOne
    private Group studentGroup;
    
    @Column(nullable = false)
    private Integer numberOfQuestions;
    
    @Column(nullable = false)
    private Integer totalMarks;
    
    @Column(nullable = false)
    private Integer passingMarks;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExamStatus status;

    
    @ManyToOne
    private MCQCategory mcqCategorie;

    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("exam-allotment")
    private List<Exam_Allotment> allotments = new ArrayList<>();
    
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("exam-questions")
    private List<Exam_Questions>  questions = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    
    public enum ExamType{
    	MCQ,PROGRAMMING
    }
    
    public enum ExamStatus{
    	Scheduled,Running,Closed
    }
    
}
