package com.example.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Entity.ProgramingQuestion;
import com.example.Service.ProgramQuestionService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/programQuestion")
public class ProgramQuestionController {

	@Autowired
	private ProgramQuestionService services;
	
	@GetMapping 
	private  ResponseEntity<?> getAllQuestion(){
		List<ProgramingQuestion> questions=services.getAllQuestions();
		if(questions.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Programing Question Found!");
		}else {
			return ResponseEntity.status(HttpStatus.OK).body(questions);
		}
	}
	
	@GetMapping("/{id}")
	private  ResponseEntity<?> getQuestionById(@PathVariable int id){
		ProgramingQuestion question=services.getQuestionById(id);
		if(question==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question with id not Found!");
		}else {
			return ResponseEntity.status(HttpStatus.OK).body(question);
		}
	}
	
	@PostMapping
	private ResponseEntity<?> saveQuestion(@RequestBody ProgramingQuestion question){
		String error_message=validateQuestion(question,false);
		try {
			if(!error_message.equals("")) return ResponseEntity.status(HttpStatus.CONFLICT).body(error_message);
			ProgramingQuestion newQuestion = services.saveQuestion(question);
			return ResponseEntity.status(HttpStatus.OK).body(newQuestion);
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	
	private String validateQuestion(ProgramingQuestion question,boolean forupdate) {
		if(question.getTitle()==null || question.getTitle()=="") return "Question Title Rqueired";
		
		if(!forupdate) {
		if(services.getQuestionByTitle(question.getTitle())!=null) return "Question title Alredy Exists";
		}
		
	    if(question.getDescription()==null || question.getDescription()=="") return "Question Description Rqueired";
		
	    
	    if(question.getReferenceAnswer()==null || question.getReferenceAnswer()=="") return "Refrence Answer Rqueired";
	    
	    if(question.getDifficulty()==null) return "question Difficulty Rqueired";
		
	    if(question.getDifficulty().equals("HARD") || question.getDifficulty().equals("MEDIUM") || question.getDifficulty().equals("EASY")) return "Difficulty Must be In(HARD,MEDIUM,EASY)";
	    
		return "";
	}
	
	
	@PutMapping("/{id}")
	private ResponseEntity<?> updateQuestion(@RequestBody ProgramingQuestion question,@PathVariable int id){
		ProgramingQuestion prevQuestion=services.getQuestionById(id);
		if(prevQuestion==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question with id not found");
		String error_message=validateQuestion(question, true);
		if(error_message!="") return ResponseEntity.status(HttpStatus.CONFLICT).body(error_message);
		if(services.getQuestionByTitle(question.getTitle())!=null && !prevQuestion.getTitle().equals(question.getTitle()))  return ResponseEntity.status(HttpStatus.CONFLICT).body("Question tittle Alredy Exists");
		
		try {
			question.setId(id);
			return ResponseEntity.status(HttpStatus.OK).body(services.saveQuestion(question));
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while updating Question");
		}
	}
	
	@DeleteMapping("/{id}")
	private ResponseEntity<?> deleteQuestion(@PathVariable int id){
		if(services.getQuestionById(id)==null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question with id not found");
		try {
		services.deleteQuestionById(id);
		return ResponseEntity.status(HttpStatus.OK).body("Question Deleted Succefully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while delete Question");
		}
	}
	
	@PostMapping("/multiple")
	private ResponseEntity<?> deleteMultipleQuestion(@RequestBody List<ProgramingQuestion> questions){
		try {
		for(ProgramingQuestion q:questions) {
			services.deleteQuestionById(q.getId());	
		}
		return ResponseEntity.status(HttpStatus.OK).body("Questions deleted Succesffuly");
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong");
		}
	}
}
