package com.example.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Exam_Allotment")
public class Exam_Allotment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer allotmentId;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonBackReference("exam-allotment")
    private Exam exam;
	
    @ManyToOne
    private Student studentId; 
    
    private Integer usedTime=0;
    
    private Boolean isAppeared=false;

    private Boolean isSubmited=false;
    
    
    
    @OneToMany(mappedBy = "allotment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("allotment-answer")
    private List<Exam_Answer>  answers = new ArrayList<>();
    
    @OneToOne(mappedBy = "allotment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("allotment-result")
    private Exam_Result results;

    @OneToOne(mappedBy = "allotment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("allotment-security")
    private Exam_Security_log securityLog;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
