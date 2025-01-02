package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Allotment;
import com.example.Entity.Exam_Security_log;
import java.util.List;


@Repository
public interface ExamSecurityRepo extends JpaRepository<Exam_Security_log, Integer> {
	
	Exam_Security_log findByAllotment(Exam_Allotment allotment);
}
