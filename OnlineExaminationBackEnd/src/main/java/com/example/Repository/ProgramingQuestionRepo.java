package com.example.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.ProgramingQuestion;

@Repository
public interface ProgramingQuestionRepo extends JpaRepository<ProgramingQuestion, Integer>{
	List<ProgramingQuestion> findByDifficulty(com.example.Entity.Question.Difficulty difficulty);
	
	ProgramingQuestion findByTitle(String title);
}
