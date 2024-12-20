package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Questions;

@Repository
public interface ExamQuestionRepo extends JpaRepository<Exam_Questions, Integer>{

}
