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
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="Exam_Security_log ")
public class Exam_Security_log {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long securityLogId;

    @ManyToOne
    @JoinColumn(name = "allotment_id", nullable = false)
    @JsonBackReference("allotment-security")
    private Exam_Allotment allotment;

    private Integer tabSwitchCount=0;
    private Integer browserClosed=0;
    @Column(name="login_ip")
    private String firstLoginIp;
    private Boolean loginAble=true; 
    private Boolean isSuspicious=false;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
