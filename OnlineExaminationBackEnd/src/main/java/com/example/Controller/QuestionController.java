package com.example.Controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Entity.MCQOption;
import com.example.Entity.Question;
import com.example.Entity.Student;
import com.example.Entity.Users;
import com.example.Entity.Question.Difficulty;
import com.example.Service.CategoryServices;
import com.example.Service.QuestionService;
import com.opencsv.CSVReader;

import Dto.QuestionDto;
import Dto.StudentDto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/question")
public class QuestionController {

	@Autowired 
	private QuestionService questionService;
	
	@Autowired
	private CategoryServices categoryService;
	
	//fetching all Mcq Question
	@GetMapping
	public ResponseEntity<?> getAllQuestions() {
		List<Question> question=questionService.getAllQuestion();
		if(question.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Question Found");
		}else {
			return ResponseEntity.status(HttpStatus.OK).body(question);
		}
	}
	//fetching  Mcq Question with id
	@GetMapping("/{id}")
	public ResponseEntity<?> getQuestionsById(@PathVariable int id) {
		Question question=questionService.getQuestionById(id);
		if(question==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Question Found By Id :"+id);
		}else {
			return ResponseEntity.status(HttpStatus.OK).body(question);
		}
	}
	
	
	//saving Mcq Question
	@PostMapping
	public ResponseEntity<?> saveMcqQuetion(@RequestBody QuestionDto questions){
		//Validating Mcq Question
		String error=validateQuestionData(questions);
		if(error!="") {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
		}
		try {
			//creating new Mcq Question
			Question newQuestion=new Question();
			newQuestion.setDifficulty(Difficulty.valueOf(questions.getDificulty()));
			newQuestion.setText(questions.getText());
			newQuestion.setCatagory(categoryService.getCategoryById(questions.getCategoryId()));
			Question savedQuestion=questionService.saveQuestion(newQuestion);
			
			//creating Question Realated Options
			try {
				if(questions.getOption1()!="") {
					MCQOption option=new MCQOption();
					option.setText(questions.getOption1());
					option.setQuestion(savedQuestion);
					//checking this option is right ans or not
					if(questions.getOption1().equals(questions.getAnswer())) {
						option.setCorrect(true);
					}
					questionService.saveOption(option);
				}
				if(questions.getOption2()!="") {
					MCQOption option=new MCQOption();
					option.setText(questions.getOption2());
					option.setQuestion(savedQuestion);
					//checking this option is right ans or not
					if(questions.getOption2().equals(questions.getAnswer())) {
						option.setCorrect(true);
					}
					questionService.saveOption(option);
				}
				if(questions.getOption3()!="") {
					MCQOption option=new MCQOption();
					option.setText(questions.getOption3());
					option.setQuestion(savedQuestion);
					//checking this option is right ans or not
					if(questions.getOption3().equals(questions.getAnswer())) {
						option.setCorrect(true);
					}
					questionService.saveOption(option);
				}
				if(questions.getOption4()!="") {
					MCQOption option=new MCQOption();
					option.setText(questions.getOption4());
					option.setQuestion(savedQuestion);
					//checking this option is right ans or not
					if(questions.getOption4 ().equals(questions.getAnswer())) {
						option.setCorrect(true);
					}
					questionService.saveOption(option);
				}
			return ResponseEntity.status(HttpStatus.OK).body("Question Saved Succefully");
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem Saving Options");
			}
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem Saving Question1");
		}
		
	}
	
	//deleting Mcq Question with id 
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteQuestion(@PathVariable int id){
		if(questionService.getQuestionById(id)!=null) {
			try {
			questionService.deleteQuestionById(id);
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Problem While deleting Question");
			}
			return ResponseEntity.status(HttpStatus.OK).body("Question by id "+id+" Deleted Succeffulyy");
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question by id "+id+" Not Found");
		}
	}
	
	//deleting Multiple Mcq Question
	@PostMapping("/multiple")
	public ResponseEntity<?> deleteMultipleQuestion(@RequestBody List<Question> questions){
		try {
			for(Question q:questions) {
				questionService.deleteQuestionById(q.getQuesionId());
			}
			return ResponseEntity.status(HttpStatus.OK).body("Questios Deleted Succefully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem Deleting Questions");
		}
	}
	
	//update question controller
	@PutMapping("/{id}")
	public ResponseEntity<?> updateQuestion(@PathVariable int id,@RequestBody QuestionDto question){
		Question prevQuestion=questionService.getQuestionById(id);
		//checking if question text is not null and question should not already exists
		if(question.getText()==null || question.getText().equals("")) return ResponseEntity.status(HttpStatus.CONFLICT).body("Question Text Required");
		if(questionService.findByText(question.getText())!=null && !question.getText().equals(prevQuestion.getText())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Question Alredy Exists");
		}else {
			prevQuestion.setText(question.getText());
		}
		
		if(!(prevQuestion.getCatagory().getId()==question.getCategoryId())) {
			if(categoryService.getCategoryById(question.getCategoryId())==null) return ResponseEntity.status(HttpStatus.CONFLICT).body("Category Not Found");
			prevQuestion.setCatagory(categoryService.getCategoryById(question.getCategoryId()));
		}
		//updating question difficulty if changed
		if(!(prevQuestion.getDifficulty().equals(question.getDificulty()))){
			if(!(question.getDificulty().equals("EASY") || question.getDificulty().equals("MEDIUM") || question.getDificulty().equals("HARD"))) return ResponseEntity.status(HttpStatus.CONFLICT).body("Dificulty Must be in(HARD,Medium,EASY)");
			prevQuestion.setDifficulty(Difficulty.valueOf(question.getDificulty()));
		}
		try {
			try {
					//handling option change
					if(!(question.getOption1()!=null && question.getOption2()!=null)) return ResponseEntity.status(HttpStatus.CONFLICT).body("Option 1 & 2 Required");
					else {
						boolean isAnwerFind=false;
						if(question.getOption1().equals(question.getAnswer())) isAnwerFind=true;						
						else if(question.getOption2().equals(question.getAnswer())) isAnwerFind=true;
						else if(question.getOption3()!=null) {
							if(question.getOption3().equals(question.getAnswer())) isAnwerFind=true;
						}
						else if(question.getOption4()!=null) {
							if(question.getOption4().equals(question.getAnswer())) isAnwerFind=true;
						}
						//checking answer match or not
						if(!isAnwerFind) return ResponseEntity.status(HttpStatus.CONFLICT).body("Anwer Not Match");
					}
					List<MCQOption> options=questionService.getAllOptionByQuestionId(questionService.getQuestionById(id));
					//saving option 1
					MCQOption option1=options.get(0);
					option1.setText(question.getOption1());
					if(question.getOption1().equals(question.getAnswer())) option1.setCorrect(true);
					else option1.setCorrect(false);
					questionService.saveOption(option1);
					
					//saving option 2
					
					MCQOption option2=options.get(1);
					option2.setText(question.getOption2());
					if(question.getOption2().equals(question.getAnswer())) option2.setCorrect(true);
					else option2.setCorrect(false);
					questionService.saveOption(option2);

					//saving option 3
					if(question.getOption3()!=null) {
						if(options.size()>2) {
						MCQOption option3=options.get(2);
						option3.setText(question.getOption3());
						if(question.getOption3().equals(question.getAnswer())) option3.setCorrect(true);
						else option3.setCorrect(false);
						questionService.saveOption(option3);
						}else {
							MCQOption newOption3=new MCQOption();
							newOption3.setText(question.getOption3());
							newOption3.setQuestion(prevQuestion);
							if(question.getOption3().equals(question.getAnswer())) newOption3.setCorrect(true);
							questionService.saveOption(newOption3);
						}
					}else {
						if(options.size()>2) {
						if(options.get(2) != null) questionService.deleteOptionById(options.get(2).getOption_id());
						}
					}
					
					
					//saving option 4
					if(question.getOption4()!=null) {
						if( options.size()>3) {
						MCQOption option4=options.get(3);
						option4.setText(question.getOption4());
						if(question.getOption4().equals(question.getAnswer())) option4.setCorrect(true);
						else option4.setCorrect(false);
						questionService.saveOption(option4);
						}else {
							MCQOption newOption4=new MCQOption();
							newOption4.setText(question.getOption3());
							newOption4.setQuestion(prevQuestion);
							if(question.getOption3().equals(question.getAnswer())) newOption4.setCorrect(true);
							questionService.saveOption(newOption4);
						}
					}else {
						if(options.size()>3) {
						if(options.get(3) != null) questionService.deleteOptionById(options.get(3).getOption_id());
						}
					}
			
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem  Updating Options");
			}
			Question savedQuestion= questionService.saveQuestion(prevQuestion);
			return ResponseEntity.status(HttpStatus.OK).body(savedQuestion); 
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem  Updating Question");
		}
	}
	
	
	//creating multiple mcq through csv file upload
    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file, @RequestParam("categoryId") int categoryId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }
        int count=0;
        String ErrorMessage="";
        boolean isError=false;
        // Process the file and convert to a list of StudentDto
        List<QuestionDto> questions=null;
		try {
			//function for reading csv file and its return QuetionDto obj list
			questions = processCsvToQuestionDto(file,categoryId);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somthing went wrong while procecing File");
		}
		Users newUser=new Users();
		//creating multiple questions
		for(QuestionDto que:questions){
			String message=validateQuestionData(que);
			if(message!="") {
				ErrorMessage+="Questions: "+que.getText()+" Error:"+message+";";
				isError=true;
			}else {
				Question newQuestion=new Question();
				try {
					newQuestion.setDifficulty(Difficulty.valueOf(que.getDificulty()));
					newQuestion.setText(que.getText());
					newQuestion.setCatagory(categoryService.getCategoryById(que.getCategoryId()));
					Question savedQuestion=questionService.saveQuestion(newQuestion);
					
					try {
						if(que.getOption1()!="") {
							MCQOption option=new MCQOption();
							option.setText(que.getOption1());
							option.setQuestion(savedQuestion);
							if(que.getOption1().equals(que.getAnswer())) {
								option.setCorrect(true);
							}
							questionService.saveOption(option);
						}
						if(que.getOption2()!="") {
							MCQOption option=new MCQOption();
							option.setText(que.getOption2());
							option.setQuestion(savedQuestion);
							if(que.getOption2().equals(que.getAnswer())) {
								option.setCorrect(true);
							}
							questionService.saveOption(option);
						}
						if(que.getOption3()!="") {
							MCQOption option=new MCQOption();
							option.setText(que.getOption3());
							option.setQuestion(savedQuestion);
							if(que.getOption3().equals(que.getAnswer())) {
								option.setCorrect(true);
							}
							questionService.saveOption(option);
						}
						if(que.getOption4()!="") {
							MCQOption option=new MCQOption();
							option.setText(que.getOption4());
							option.setQuestion(savedQuestion);
							if(que.getOption4().equals(que.getAnswer())) {
								option.setCorrect(true);
							}
							questionService.saveOption(option);
						}
					
					}catch(Exception e) {
						ErrorMessage+="\n Error while savingOptions for question:"+newQuestion.getText();
					}
				}catch(Exception e) {
					ErrorMessage+="\n Error while saving question for question:"+newQuestion.getText();
				}
			}
		}
		if(isError) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
	            "error", ErrorMessage,"recordInserted", count
	            ));
        // Return the number of records processed
        return ResponseEntity.ok("File processed successfully. Number of records: " + questions.size());
    }

    //function that read csv file and convert it to Question dto
    private List<QuestionDto> processCsvToQuestionDto(MultipartFile file,int categoryId) throws Exception {
        List<QuestionDto> questions = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            CSVReader csvReader = new CSVReader(reader)) {

            String[] nextLine;
            boolean isHeader = true;

            while ((nextLine = csvReader.readNext()) != null) {
                if (isHeader) { 
                    isHeader = false; // Skip the header row
                    continue; 
                }
                
                // Assuming the columns are in order: name, unique_id, program, semester, division, number
                String text = nextLine[0];
                String difficulty = nextLine[1];
                String option1 = nextLine[2];
                String option2 = nextLine[3];
                String option3 = nextLine[4];
                String option4 = nextLine[5];
                String answer = nextLine[6];
                
                QuestionDto question=new QuestionDto();
                question.setText(text);
                question.setDificulty(difficulty);
                question.setCategoryId(categoryId);
                question.setOption1(option1);
                question.setOption2(option2);
                question.setOption3(option3);
                question.setOption4(option4);
                question.setAnswer(answer);

                questions.add(question);
            }

        } catch (IOException e) {
            e.printStackTrace();
            // Handle IOException here
        }

        return questions;
    }
    	
	
    //validating mcq question
	public String validateQuestionData(QuestionDto question) {
		String message="";
		boolean isAnwerFind=false;
		if(question.getText().equals("")) {
			message+="Question Text Required";
		}else if(questionService.findByText(question.getText())!=null) {
			message+="\nQuestion Alredy Exists";
		}
		
		if(!(question.getDificulty().equals("EASY") || question.getDificulty().equals("MEDIUM") || question.getDificulty().equals("HARD"))) {
			message+="\nDificulty Must be in (EASY,MEDIUM,HARD)";
		}
		
		if(categoryService.getCategoryById(question.getCategoryId())==null) {
			message+="\nCategory Not Found";
		}
		
		if(question.getOption1()==null) {
			message+="\nOption 1 Required";
		}else {
			if(question.getOption1().equals(question.getAnswer())) isAnwerFind=true;
		}
		
		if(question.getOption2()==null) {
			message+="\nOption 2 Required";
		}else {
			if(question.getOption2().equals(question.getAnswer())) isAnwerFind=true;
		}
		
		if(question.getOption3()!=null) {
			if(question.getOption3().equals(question.getAnswer())) isAnwerFind=true;
		}
		
		if(question.getOption4()!=null) {
			if(question.getOption4().equals(question.getAnswer())) isAnwerFind=true;
		}
		if(question.getAnswer()==null) {
			message+="\nAnswer Required";
		}else {
			if(!isAnwerFind) message+="\n Anwer Not Match";
		}
		
			return message;
	}
	
	
}
