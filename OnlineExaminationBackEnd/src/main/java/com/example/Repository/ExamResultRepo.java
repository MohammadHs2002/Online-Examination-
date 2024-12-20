package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Result;

@Repository
public interface ExamResultRepo  extends JpaRepository<Exam_Result,Integer>{

}
