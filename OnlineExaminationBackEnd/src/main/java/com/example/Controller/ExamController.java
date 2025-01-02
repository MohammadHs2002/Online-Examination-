package com.example.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

import com.example.Entity.Exam;
import com.example.Entity.Exam.ExamStatus;
import com.example.Entity.Exam.ExamType;
import com.example.Entity.Exam_Allotment;
import com.example.Entity.Exam_Answer;
import com.example.Entity.Exam_Questions;
import com.example.Entity.Exam_Security_log;
import com.example.Entity.Group;
import com.example.Entity.Logger;
import com.example.Entity.MCQCategory;
import com.example.Entity.Question.Difficulty;
import com.example.Entity.Student;
import com.example.Entity.Users;
import com.example.Repository.AllotmentRepo;
import com.example.Repository.CatagoryRepo;
import com.example.Repository.GroupRepo;
import com.example.Service.CategoryServices;
import com.example.Service.ExamSchedulerService;
import com.example.Service.ExamServices;
import com.example.Service.GroupService;
import com.example.Service.UserServices;
import com.example.validation.Action;

import Dto.ExamDto;
import Dto.ExamFetchDto;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/exam")
public class ExamController {
	@Autowired
	private ExamServices examServices;
	
	@Autowired GroupService groupServices;
	
	@Autowired CategoryServices mcqCategoryServices;
	
	@Autowired
    private ExamSchedulerService examSchedulerService;
	
	@Autowired
	private UserServices userServices;
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@GetMapping 
	public ResponseEntity<?> getAllExams(){
		List<Exam> examList=examServices.getAllExams();
		if(examList.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found");
		else return ResponseEntity.status(HttpStatus.OK).body(examList);
	} 
	
	@GetMapping("/allotments") 
	public ResponseEntity<?> getAllAllotments(){
		List<ExamFetchDto> allotments=examServices.getAllAllotments();
		if(allotments.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found");
		else return ResponseEntity.status(HttpStatus.OK).body(allotments);
	}
	
	
	@GetMapping("/allotments/{id}") 
	public ResponseEntity<?> getAllotmentsById(@PathVariable int id){
		ExamFetchDto dtoAllotment=new ExamFetchDto();
		Exam_Allotment allotment=examServices.getAllotmentById(id);
		dtoAllotment.setAllotment(allotment);
		dtoAllotment.setExam(allotment.getExam());
		
		if(allotment==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Allotment Found");
		else return ResponseEntity.status(HttpStatus.OK).body(dtoAllotment);
	}
	
	@GetMapping("/{id}") 
	public ResponseEntity<?> getExamsById(@PathVariable Integer id){
		Exam exam=examServices.getExamById(id);
		if(exam==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found with given id");
		else return ResponseEntity.status(HttpStatus.OK).body(exam);
	} 
	
	@PostMapping
	public ResponseEntity<?> createNewExam(@RequestBody ExamDto examDto){
		Exam exam=examToExamDto(examDto);
		String Error_message=validateExam(exam);
		try {
			if(!Error_message.equals(""))return ResponseEntity.status(HttpStatus.CONFLICT).body(Error_message);
			exam.setStudentGroup(groupServices.getGroupById(exam.getStudentGroup().getId()));
			if(exam.getExamType().equals(ExamType.MCQ))exam.setMcqCategorie(mcqCategoryServices.getCategoryById(exam.getMcqCategorie().getId()));
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
			examSchedulerService.scheduleExam(exam);
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
	
	@DeleteMapping("/allotments/{id}")
	public ResponseEntity<?> deleteAllotmentById(@PathVariable Integer id){
		try{
				examServices.deleteAllotmentById(id);
				return  ResponseEntity.status(HttpStatus.OK).body("Allotment Deleted Succefully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	
	
	@PutMapping("/status/{id}")
	public ResponseEntity<?> updateExamStatus(@PathVariable int id,@RequestBody Map<String, String> formData){
		try {
			Exam e=examServices.getExamById(id);
			e.setStatus(ExamStatus.valueOf(formData.get("status")));
			examServices.saveExam(e);
			return  ResponseEntity.status(HttpStatus.OK).body("Exam Status Updated Sucessfully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	@PutMapping("/result/{id}")
	public ResponseEntity<?> updateExamResultStatus(@PathVariable int id,@RequestBody Map<String, Boolean> formData){
		try {
			Exam e=examServices.getExamById(id);
			e.setResultDeclared(formData.get("result"));
			examServices.saveExam(e);
			return  ResponseEntity.status(HttpStatus.OK).body("Exam Result Status Updated Sucessfully");
		}catch(Exception e) {
			System.out.println();
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	@PostMapping("/multiple")
	public ResponseEntity<?> DeleteMultipleExams(@RequestBody List<Exam> exams){
		try {
			for(Exam e:exams) {
				examServices.deleteExamById(e.getExamId());
			}
			return  ResponseEntity.status(HttpStatus.OK).body("Multiple Exams Deleted Succefully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	@PostMapping("/allotments/multiple")
	public ResponseEntity<?> DeleteMultipleAllotments(@RequestBody List<Exam_Allotment> allotments){
		try {
			for(Exam_Allotment e:allotments) {
				examServices.deleteAllotmentById(e.getAllotmentId());
			}	
			return  ResponseEntity.status(HttpStatus.OK).body("Multiple Allotments Deleted Succefully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
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
	
	private Exam examToExamDto(ExamDto dto) {
		Exam e=new Exam();
		Group g=new Group();
		g.setId(dto.getStudentGroup());
		e.setExamName(dto.getExamName());
		e.setExamDuration(dto.getExamDuration());
		e.setExamStartDateTime(dto.getExamStartDateTime());
		e.setExamType(dto.getExamType());
		e.setExamDifficulty(dto.getExamDifficulty());
		e.setStudentGroup(g);
		if(dto.getExamType().equals(ExamType.MCQ)) {
			MCQCategory category=new MCQCategory();
			category.setId(dto.getMcqCategorie());
			e.setMcqCategorie(category);
		}
		e.setResultDeclared(false);
		e.setNumberOfQuestions(dto.getNumberOfQuestions());
		e.setTotalMarks(dto.getTotalMarks());
		e.setPassingMarks(dto.getPassingMarks());
		return e;
	}
	
	
	//Student Side Handling
	@PostMapping("/get_allotments")
	public ResponseEntity<?> getAllotmentsByStudent(@RequestBody Users user){
		List<ExamFetchDto> exams=examServices.getAllExamsByUser(user);
		if(exams.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exams Found");
		else return ResponseEntity.status(HttpStatus.OK).body(exams);
	}
	
	
	@PostMapping("/submitMcqAnswer/{answerId}")
	public ResponseEntity<?> submitAnswerMcq(@RequestBody Map<String,Integer> answerData, @PathVariable int answerId) {
	    // Assuming the saveAnswer method returns the saved answer or null if there was an issue.
		int optionId=answerData.get("optionId");
	    Exam_Answer answer = examServices.saveAnswer(optionId, answerId);
	    
	    if (answer != null) {
	        return ResponseEntity.status(HttpStatus.OK).body(answer);  // Return saved answer with OK status
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Something went wrong while saving the answer.");
	    }
	}

	
	
@PostMapping("/examLogin/{allotmentId}")
public ResponseEntity<?> examLogin(@RequestBody Users user, @PathVariable int allotmentId, HttpServletRequest request) {
    Users getUser = userServices.loginUser(user.getUsername());
    if (getUser == null) {
        return createErrorResponse("User Not Found", HttpStatus.CONFLICT);
    }

    Exam_Allotment allotment = examServices.getAllotmentById(allotmentId);
    if (!user.getUsername().equals(allotment.getStudentId().getUser().getUsername())) {
        return createErrorResponse("Please Provide Your Username", HttpStatus.CONFLICT);
    }

    // Verify password
    if (!encoder.matches(user.getPassword(), getUser.getPassword())) {
        return createErrorResponse("Wrong Password", HttpStatus.CONFLICT);
    }

    // Check user is active
    if (!getUser.isActive()) {
        return createErrorResponse("User Blocked", HttpStatus.CONFLICT);
    }

    // Verify exam status
    if (allotment.getExam().getStatus() != ExamStatus.Running) {
        return createErrorResponse("This Exam Is Closed", HttpStatus.CONFLICT);
    }

    // Check for suspicious activity
    Exam_Security_log securityLog = allotment.getSecurityLog();
    if (!securityLog.getLoginAble()) {
        return createErrorResponse("Blocked For Suspicious Activity! Contact Admin", HttpStatus.CONFLICT);
    }

    // Handle login logic
    return handleLoginLogic(allotment, request, getUser);
}

private ResponseEntity<?> handleLoginLogic(Exam_Allotment allotment, HttpServletRequest request, Users getUser) {
    Exam_Security_log log = allotment.getSecurityLog();

    if (allotment.getIsAppeared()) {
        // User has already appeared for the exam
    	allotment.setIsAppeared(true);
        if (!log.getFirstLoginIp().equals(request.getRemoteAddr())) {
            return createErrorResponse("Please Login From The Same Device", HttpStatus.CONFLICT);
        }
    } else {
        // First login attempt
        allotment.setIsAppeared(true);
        log.setFirstLoginIp(request.getRemoteAddr());
        examServices.updateSecurityLog(log);
        examServices.updateAllotment(allotment);
    }

    return ResponseEntity.status(HttpStatus.OK).body(getUser);
}

private ResponseEntity<?> createErrorResponse(String message, HttpStatus status) {
    return ResponseEntity.status(status).body(message);
}


	@PostMapping("/updateStudentTimer/{allotmentId}")
	public ResponseEntity<?> UpdateStudentUsedTime(@RequestBody Map<String,Integer> usedTime,@PathVariable int allotmentId){
			
		if(examServices.updateUsedTime(usedTime.get("time"),allotmentId)) {
			return ResponseEntity.status(HttpStatus.OK).body("Time Updated "+usedTime.get("time"));
			}else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while Updating Time");
			}
	}

	
	@PostMapping("/securityLog/{allotmentId}")
	public ResponseEntity<?> securityLog(@PathVariable int allotmentId,@RequestBody Map<String,String> actionType){
			try {
				Exam_Security_log log= examServices.updateSecurityLog(actionType.get("action"),allotmentId);
				return ResponseEntity.status(HttpStatus.OK).body(log);
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while storing security log");
			}
	}
	
	
	@GetMapping("/submitExam/{allotmentId}")
	public ResponseEntity<?>  submitExam(@PathVariable int allotmentId){
			if(examServices.submitSingleExam(allotmentId)) {
				return ResponseEntity.status(HttpStatus.OK).body("Exam Submited Succefully");
			}else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while Submiting exam");
			}
	}
}
