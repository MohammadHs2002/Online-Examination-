package com.example.Entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Exam_Answer")
public class Exam_Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer answerId;

    @ManyToOne
    @JoinColumn(name = "allotment_id", nullable = false)
    @JsonBackReference("allotment-answer")
    private Exam_Allotment allotment;

    @ManyToOne
    private Exam_Questions question;

    private String programmingAnswerText;
    private Integer selectedOptionId;
    private Boolean isAnswered=false;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
