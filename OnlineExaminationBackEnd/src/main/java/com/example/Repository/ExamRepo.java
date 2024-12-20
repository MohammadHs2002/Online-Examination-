package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam;

@Repository
public interface ExamRepo extends JpaRepository<Exam, Integer>{

}
