package com.example.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.Entity.Question.Difficulty;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "programming_questions")
public class ProgramingQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false,unique = true)
    private String title;

    @Column(nullable = false,columnDefinition = "varchar(MAX)")
    private String description;

    @Column(nullable = false,columnDefinition = "varchar(MAX)")
    private String sampleInput;
    
    @Column(nullable = false,columnDefinition = "varchar(MAX)")
    private String sampleOutput;
    
    private String hints;

    @Column(columnDefinition = "varchar(MAX)")
    private String referenceAnswer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
