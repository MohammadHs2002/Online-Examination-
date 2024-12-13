package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.MCQOption;
import com.example.Entity.Question;

import java.util.List;


@Repository
public interface MCQOptionRepo extends JpaRepository<MCQOption, Integer>{
	List<MCQOption> findByQuestion(Question question);
}
