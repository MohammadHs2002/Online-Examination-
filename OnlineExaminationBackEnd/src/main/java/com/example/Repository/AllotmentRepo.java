package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Exam_Allotment;
import com.example.Entity.Student;

import java.util.List;


@Repository
public interface AllotmentRepo extends JpaRepository<Exam_Allotment, Integer> {
	List<Exam_Allotment> findByStudentId(Student studentId);
}
