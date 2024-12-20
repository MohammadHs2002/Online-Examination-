package com.example.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.ProgramingQuestion;
import com.example.Entity.Question.Difficulty;
import com.example.Repository.ProgramingQuestionRepo;

@Service
public class ProgramQuestionService {
	@Autowired
	private ProgramingQuestionRepo proQueRepo;
	
	
	public List<ProgramingQuestion> getAllQuestions(){
		return proQueRepo.findAll();
	}
	
	public ProgramingQuestion getQuestionById(int id) {
		return proQueRepo.findById(id).orElse(null);
	}
	
	public ProgramingQuestion saveQuestion(ProgramingQuestion p1) {
		return proQueRepo.save(p1);
	}
	
	public void deleteQuestionById(int id) {
		proQueRepo.deleteById(id);
	}
	
	public List<ProgramingQuestion> getQuestionByCategory(Difficulty dif){
		return proQueRepo.findByDifficulty(dif);
	}
	
	public ProgramingQuestion getQuestionByTitle(String title) {
		return (ProgramingQuestion) proQueRepo.findByTitle(title);
	}
}

