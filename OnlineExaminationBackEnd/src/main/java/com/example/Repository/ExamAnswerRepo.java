package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Answer;

@Repository
public interface ExamAnswerRepo extends JpaRepository<Exam_Answer, Integer>{

}
