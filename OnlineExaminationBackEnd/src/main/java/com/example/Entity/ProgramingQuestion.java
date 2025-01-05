package com.example.Entity;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.Entity.Question.Difficulty;
import com.fasterxml.jackson.annotation.JsonIgnore;


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
    
    @OneToMany(mappedBy = "programQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Exam_Questions>  question = new ArrayList<>();

}
