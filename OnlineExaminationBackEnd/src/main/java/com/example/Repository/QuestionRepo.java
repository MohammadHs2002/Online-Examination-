package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Question;

@Repository
public interface QuestionRepo  extends JpaRepository<Question, Integer>{
	Question findByText(String text);
}
