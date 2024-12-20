package com.example.Entity;
import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Exam_Result")
public class Exam_Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @OneToOne
    @JoinColumn(name = "allotment_id", nullable = false)
    @JsonBackReference("allotment-result")
    private Exam_Allotment allotment;

    private Integer rightQuestions;
    
    private Integer wrongQuestions;
    private Integer marks;

    @Enumerated(EnumType.STRING)
    private ResultStatus resultStatus=ResultStatus.Pending; // Pass, Fail, Pending, Disqualified

    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum ResultStatus{
    	Pass,Fail,Pending,Disqualified
    }
}
