package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Allotment;
import com.example.Entity.Exam_Answer;
import java.util.List;


@Repository
public interface ExamAnswerRepo extends JpaRepository<Exam_Answer, Integer>{
		List<Exam_Answer> findByAllotment(Exam_Allotment allotment);
}
