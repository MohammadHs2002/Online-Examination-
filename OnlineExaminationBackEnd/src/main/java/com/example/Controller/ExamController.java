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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Entity.Exam;
import com.example.Entity.Exam.ExamType;
import com.example.Entity.Exam_Allotment;
import com.example.Entity.Exam_Answer;
import com.example.Entity.Exam_Questions;
import com.example.Entity.Question.Difficulty;
import com.example.Repository.CatagoryRepo;
import com.example.Repository.GroupRepo;
import com.example.Service.CategoryServices;
import com.example.Service.ExamServices;
import com.example.Service.GroupService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/Exam")
public class ExamController {
	@Autowired
	private ExamServices examServices;
	
	@Autowired GroupService groupServices;
	
	@Autowired CategoryServices mcqCategoryServices;
	
	@GetMapping 
	public ResponseEntity<?> getAllExams(){
		List<Exam> examList=examServices.getAllExams();
		if(examList.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found");
		else return ResponseEntity.status(HttpStatus.OK).body(examList);
	} 
	
	@GetMapping("/{id}") 
	public ResponseEntity<?> getAllExams(@PathVariable Integer id){
		Exam exam=examServices.getExamById(id);
		if(exam==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found with given id");
		else return ResponseEntity.status(HttpStatus.OK).body(exam);
	} 
	
	@PostMapping
	public ResponseEntity<?> createNewExam(@RequestBody Exam exam){
		String Error_message=validateExam(exam);
		try {
			if(!Error_message.equals(""))return ResponseEntity.status(HttpStatus.CONFLICT).body(Error_message);
			exam.setStudentGroup(groupServices.getGroupById(exam.getStudentGroup().getId()));
			exam.setMcqCategorie(mcqCategoryServices.getCategoryById(exam.getMcqCategorie().getId()));
			Exam e=examServices.saveExam(exam);
			try {
				List<Exam_Allotment> allotmnets=examServices.saveAllotments(e, e.getStudentGroup().getId());
				try {
					List<Exam_Questions> questions=examServices.saveMappedQuestion(e);
					try {
						List<Exam_Answer> answers=examServices.saveExamAnswer(questions, allotmnets);
						try {
							examServices.saveAllotment_Results_SecurtyLog(allotmnets);
						}catch(Exception ex) {
							System.out.println(ex.getMessage());
							return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Exam Result and Log ");
						}
					}catch(Exception ex) {
						System.out.println(ex.getMessage());
						return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Student Answers");
					}
				}catch(Exception ex) {
					System.out.println(ex.getMessage());
					return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Exam Questions");
				}
			}catch(Exception ex) {
				System.out.println(ex.getMessage());
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Allotmnets");
			}
			return ResponseEntity.status(HttpStatus.OK).body(examServices.getExamById(e.getExamId()));
		}catch(Exception e) {
			System.out.println(e.getMessage());
			ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating exam");
		}
		return null;
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteExamById(@PathVariable Integer id){
		Exam exam=examServices.getExamById(id);
		if(exam==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found with given id");
		else {
			examServices.deleteExamById(id);
			return ResponseEntity.status(HttpStatus.OK).body("Exam Deleted Succefully");
		}
	}
	
	private String validateExam(Exam e) {
		if(e.getExamName()==null || e.getExamName()=="") return "Exam Name Requeired";
		if(e.getExamStartDateTime()==null || e.getExamName()=="") return "Exam Date Time Requeired";
		if(e.getExamDuration()==null || e.getExamDuration()==0) return "Exam Duration Requeired";
		if(e.getExamDifficulty()==null) return "Exam Difficulty Requeired";
		if(!(e.getExamDifficulty().equals(Difficulty.EASY) || e.getExamDifficulty().equals(Difficulty.MEDIUM) || e.getExamDifficulty().equals(Difficulty.HARD)))return "Difficulty must be in (Hard,Medium,Easy)";
		if(e.getStudentGroup()==null ) return "Student Group Requeired";
		if(groupServices.getGroupById(e.getStudentGroup().getId())==null)return "student group id not found";
		if(e.getTotalMarks()==null || e.getTotalMarks()==0) return "Exam Total Marks Requeired";
		if(e.getPassingMarks()==null || e.getPassingMarks()==0) return "Exam Passing Marks Requeired";
		if(e.getExamType()==null)return "Exam Type Required";
		if(!(e.getExamType().equals(ExamType.MCQ) || e.getExamType().equals(ExamType.PROGRAMMING)))return "Exam Type Must be in (MCQ,PROGRAMMING)";
		if(e.getNumberOfQuestions()==null || e.getNumberOfQuestions()==0) return "Exams Number Of Question Required";
		if(e.getExamType().equals(ExamType.MCQ)) {
			if(e.getMcqCategorie()==null) return "Mcq Category Required";
			if(mcqCategoryServices.getCategoryById(e.getMcqCategorie().getId())==null) return "mcqCategory Id not Found";
			Integer filterSize=examServices.checkQuestionAvailibility(e);
			if(e.getNumberOfQuestions()>filterSize)return "Number Of Question Not Available For Selected Mcq Category/Difficulty "+filterSize+" Question Available";
		}
		if(e.getExamType().equals(ExamType.PROGRAMMING)) {
			Integer filterSize=examServices.checkQuestionAvailibility(e);
			if(e.getNumberOfQuestions()>filterSize)return "Number Of Question Not Available For Selected Programing Difficulty "+filterSize+" Question Available";
		}
		return "";
	}
}
