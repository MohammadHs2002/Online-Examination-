package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.MCQCategory;
import com.example.Entity.Question;
import com.example.Entity.Question.Difficulty;

import java.util.List;


@Repository
public interface QuestionRepo  extends JpaRepository<Question, Integer>{
	Question findByText(String text);
	
	List<Question> findByDifficulty(Difficulty difficulty);
	
	List<Question> findByCatagory(MCQCategory catagory);
}
