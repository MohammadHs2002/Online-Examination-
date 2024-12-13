package com.example.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.MCQOption;
import com.example.Entity.Question;
import com.example.Repository.MCQOptionRepo;
import com.example.Repository.QuestionRepo;

@Service
public class QuestionService {

	@Autowired
	private QuestionRepo questionRepo;
	
	@Autowired
	private MCQOptionRepo optionRepo;
	
	public List<Question> getAllQuestion(){
		return questionRepo.findAll();
	}
	
	public Question saveQuestion(Question question) {
		return questionRepo.save(question);
	}
	
	public MCQOption saveOption(MCQOption option) {
		return optionRepo.save(option);
	}
	
	public Question getQuestionById(int id){
		return questionRepo.findById(id).orElse(null);
	}
	
	public void deleteQuestionById(int id) {
		 questionRepo.deleteById(id);
	}
	
	public void deleteOptionById(int id) {
		optionRepo.deleteById(id);
	}
	
	public Question findByText(String text) {
		return questionRepo.findByText(text);
	}
	
	public List<MCQOption> getAllOptionByQuestionId(Question question){
		return optionRepo.findByQuestion(question);
	}
}
