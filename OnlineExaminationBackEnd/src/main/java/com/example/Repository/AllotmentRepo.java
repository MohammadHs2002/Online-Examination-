package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Allotment;

@Repository
public interface AllotmentRepo extends JpaRepository<Exam_Allotment, Integer> {

}
