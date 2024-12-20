package com.example.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Exam_Questions")
public class Exam_Questions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mappingId;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonBackReference("exam-questions")
    private Exam exam;

    @ManyToOne
    private Question mcqQuestion;

    @ManyToOne 
    private ProgramingQuestion programQuestion;
}
