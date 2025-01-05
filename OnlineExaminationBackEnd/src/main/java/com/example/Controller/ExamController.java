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
	
	//this controller provide all exams
	@GetMapping 
	public ResponseEntity<?> getAllExams(){
		//getting exams list from services
		List<Exam> examList=examServices.getAllExams();
		//if exam list is empty return no exam found
		if(examList.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found");
		else return ResponseEntity.status(HttpStatus.OK).body(examList);
	} 
	
	//this controller provide all allotments
	@GetMapping("/allotments") 
	public ResponseEntity<?> getAllAllotments(){
		//getting allotment list from services
		List<ExamFetchDto> allotments=examServices.getAllAllotments();
		//if allotment list is empty return no allotment found
		if(allotments.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Allotments Found");
		else return ResponseEntity.status(HttpStatus.OK).body(allotments);
	}
	
	//this controller provide allotment with id
	@GetMapping("/allotments/{id}") 
	public ResponseEntity<?> getAllotmentsById(@PathVariable int id){
		//making dto class for response
		ExamFetchDto dtoAllotment=new ExamFetchDto();
		//fetching allotment with id 
		Exam_Allotment allotment=examServices.getAllotmentById(id);
		//checking if allotment is not null
		if(allotment==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Allotment Found by id");
		//setting dto values
		dtoAllotment.setAllotment(allotment);
		dtoAllotment.setExam(allotment.getExam());
		return ResponseEntity.status(HttpStatus.OK).body(dtoAllotment);
	}
	
	//this controller provide exam with id 
	@GetMapping("/{id}") 
	public ResponseEntity<?> getExamsById(@PathVariable Integer id){
		//fetching exam with id 
		Exam exam=examServices.getExamById(id);
		//checking if exam is not null
		if(exam==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found with given id");
		else return ResponseEntity.status(HttpStatus.OK).body(exam);
	} 
	
	
	//this controller creats new exam
	//its check all the validation for exam 
	//returns newly created exam
	@PostMapping
	public ResponseEntity<?> createNewExam(@RequestBody ExamDto examDto){
		//fetching exam from exam dto 
		Exam exam=examToExamDto(examDto);
		//this will validate exam and return String message response
		String Error_message=validateExam(exam);
		try {
			//checking if error_message is not "" then return that message 
			if(!Error_message.equals(""))return ResponseEntity.status(HttpStatus.CONFLICT).body(Error_message);
			//adding student group whole value using provided student Group id
			exam.setStudentGroup(groupServices.getGroupById(exam.getStudentGroup().getId()));
			//its checking if exam type is MCQ then its set mcqCatgorie for exam and if not mcq exam its remain null
			if(exam.getExamType().equals(ExamType.MCQ))exam.setMcqCategorie(mcqCategoryServices.getCategoryById(exam.getMcqCategorie().getId()));
			//creating new exam 
			Exam e=examServices.saveExam(exam);
			//now this codes create exams-allotment,questions(for refrence) 
			//then allotments-answers(for Exam Continuity),result,security log(for making and log unusual event that student make)
			try {
				//creating all allotment for newly created exam returns Allotment List
				List<Exam_Allotment> allotmnets=examServices.saveAllotments(e, e.getStudentGroup().getId());
				try {
					//creating Quetions(Mapping) for newly created this shows quetion List that used in exam
					List<Exam_Questions> questions=examServices.saveMappedQuestion(e);
					try {
						//this will create answers for each allotment and provide student answer storing
						List<Exam_Answer> answers=examServices.saveExamAnswer(questions, allotmnets);
						try {
							//this will create new results,security log for each allotment
							examServices.saveAllotment_Results_SecurtyLog(allotmnets);
						}catch(Exception ex) {
							//if any problem accure during exam creation this will delete the created exam
							examServices.deleteExamById(e.getExamId());
							System.out.println(ex.getMessage());
							//result and security log creation problem
							return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Exam Result and Log ");
						}
					}catch(Exception ex) {
						//if any problem accure during exam creation this will delete the created exam
						examServices.deleteExamById(e.getExamId());
						System.out.println(ex.getMessage());
						//Answers creation problem
						return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Student Answers");
					}
				}catch(Exception ex) {
					//if any problem accure during exam creation this will delete the created exam
					examServices.deleteExamById(e.getExamId());
					System.out.println(ex.getMessage());
					//Exam Quetions creation problem
					return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Exam Questions");
				}
			}catch(Exception ex) {
				//if any problem accure during exam creation this will delete the created exam
				examServices.deleteExamById(e.getExamId());
				System.out.println(ex.getMessage());
				//allotment creation problem
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating Allotmnets");
			}
			//after exam fully creation this code schedule exam for perticular time that auto start exam
			examSchedulerService.scheduleExam(exam);
			return ResponseEntity.status(HttpStatus.OK).body(examServices.getExamById(e.getExamId()));
		}catch(Exception e) {
			System.out.println(e.getMessage());
			ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while creating exam");
		}
		return null;
	}
	
	//this controller delete exam by id
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteExamById(@PathVariable Integer id){
		Exam exam=examServices.getExamById(id);
		if(exam==null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exam Found with given id");
		else {
			examServices.deleteExamById(id);
			return ResponseEntity.status(HttpStatus.OK).body("Exam Deleted Succefully");
		}
	}
	
	//this controller delete allotment by id
	@DeleteMapping("/allotments/{id}")
	public ResponseEntity<?> deleteAllotmentById(@PathVariable Integer id){
		try{
				examServices.deleteAllotmentById(id);
				return  ResponseEntity.status(HttpStatus.OK).body("Allotment Deleted Succefully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	
	//this controller change exam status like (Scheduled,Running,closed)
	@PutMapping("/status/{id}")
	public ResponseEntity<?> updateExamStatus(@PathVariable int id,@RequestBody Map<String, String> formData){
		try {
			//getting exam by id
			Exam e=examServices.getExamById(id);
			//setting exam status
			e.setStatus(ExamStatus.valueOf(formData.get("status")));
			examServices.saveExam(e);
			//if exam status change to closed this code calculate all results fall in perticular exam
			if(e.getStatus().equals(ExamStatus.Closed)) {
				examServices.calculateAllResultsOfExam(e);
			}
			return  ResponseEntity.status(HttpStatus.OK).body("Exam Status Updated Sucessfully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	//updating exam result status like declared/not declared(T/F)
	@PutMapping("/result/{id}")
	public ResponseEntity<?> updateExamResultStatus(@PathVariable int id,@RequestBody Map<String, Boolean> formData){
		try {
			//getting exam by id
			Exam e=examServices.getExamById(id);
			//setting result status
			e.setResultDeclared(formData.get("result"));
			examServices.saveExam(e);
			return  ResponseEntity.status(HttpStatus.OK).body("Exam Result Status Updated Sucessfully");
		}catch(Exception e) {
			System.out.println();
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	//this controller delete multiple exams
	@DeleteMapping("/multiple")
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
	
	//this will delete multiple allotments
	@DeleteMapping("/allotments/multiple")
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
	//this functin used in create exam controller 
	//this will validate all requeired data for new exam creation
	private String validateExam(Exam e) {
		//null value checking for requeired field
		if(e.getExamName()==null || e.getExamName()=="") return "Exam Name Requeired";
		if(e.getExamStartDateTime()==null || e.getExamName()=="") return "Exam Date Time Requeired";
		if(e.getExamDuration()==null || e.getExamDuration()==0) return "Exam Duration Requeired";
		if(e.getExamDifficulty()==null) return "Exam Difficulty Requeired";
		if(!(e.getExamDifficulty().equals(Difficulty.EASY) || e.getExamDifficulty().equals(Difficulty.MEDIUM) || e.getExamDifficulty().equals(Difficulty.HARD)))return "Difficulty must be in (Hard,Medium,Easy)";
		if(e.getStudentGroup()==null ) return "Student Group Requeired";
		if(e.getTotalMarks()==null || e.getTotalMarks()==0) return "Exam Total Marks Requeired";
		if(e.getPassingMarks()==null || e.getPassingMarks()==0) return "Exam Passing Marks Requeired";
		if(e.getExamType()==null)return "Exam Type Required";
		
		//checking if prvided data is valid of on eg.student group existing,ExamType valid;
		if(groupServices.getGroupById(e.getStudentGroup().getId())==null)return "student group id not found";
		if(!(e.getExamType().equals(ExamType.MCQ) || e.getExamType().equals(ExamType.PROGRAMMING)))return "Exam Type Must be in (MCQ,PROGRAMMING)";
		if(e.getNumberOfQuestions()==null || e.getNumberOfQuestions()==0) return "Exams Number Of Question Required";
		//this code validate MCQ exam things
		if(e.getExamType().equals(ExamType.MCQ)) {
			if(e.getMcqCategorie()==null) return "Mcq Category Required";
			if(mcqCategoryServices.getCategoryById(e.getMcqCategorie().getId())==null) return "mcqCategory Id not Found";
			Integer filterSize=examServices.checkQuestionAvailibility(e);
			//checking if number of quetion available of not for provided Category/Difficulty
			if(e.getNumberOfQuestions()>filterSize)return "Number Of Question Not Available For Selected Mcq Category/Difficulty "+filterSize+" Question Available";
		}
		if(e.getExamType().equals(ExamType.PROGRAMMING)) {
			//checking if number of quetion available of not for provided Category/Difficulty
			Integer filterSize=examServices.checkQuestionAvailibility(e);
			if(e.getNumberOfQuestions()>filterSize)return "Number Of Question Not Available For Selected Programing Difficulty "+filterSize+" Question Available";
		}
		return "";
	}
	
	//this code convert exam dto obj to exam obj
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
	
	// now This controller/api is used is student side
	
	//this controller fetch all alotment for perticular student
	@PostMapping("/get_allotments")
	public ResponseEntity<?> getAllotmentsByStudent(@RequestBody Users user){
		List<ExamFetchDto> exams=examServices.getAllExamsByUser(user);
		if(exams.isEmpty())return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Exams Found");
		else return ResponseEntity.status(HttpStatus.OK).body(exams);
	}
	
	//this controller save mcq answer of student
	@PostMapping("/submitMcqAnswer/{answerId}")
	public ResponseEntity<?> submitAnswerMcq(@RequestBody Map<String,Integer> answerData, @PathVariable int answerId) {
	    // getting optiond id 
		int optionId=answerData.get("optionId");
		//saving mcq Answer
	    Exam_Answer answer = examServices.saveMcqAnswer(optionId, answerId);
	    // Return saved answer with OK status
	    if (answer != null) {
	        return ResponseEntity.status(HttpStatus.OK).body(answer); 
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Something went wrong while saving the answer.");
	    }
	}
	
	
	//this controller save Programming answer of student
	@PostMapping("/submitProgramingAnswer/{answerId}")
	public ResponseEntity<?> submitAnswerPrograming(@RequestBody Map<String,String> answerData, @PathVariable int answerId) {
	    // getting code text
		String code=answerData.get("code");
		//saving programing answer
	    Exam_Answer answer = examServices.saveProgramingAnswer(code, answerId);
	    // Return saved answer with OK status
	    if (answer != null) {
	        return ResponseEntity.status(HttpStatus.OK).body(answer);  // Return saved answer with OK status
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Something went wrong while saving the answer.");
	    }
	}

	
//Exam Login for Extra security eg.same ip login
@PostMapping("/examLogin/{allotmentId}")
public ResponseEntity<?> examLogin(@RequestBody Users user, @PathVariable int allotmentId, HttpServletRequest request) {
	//cheking user exists or not
    Users getUser = userServices.loginUser(user.getUsername());
    if (getUser == null) {
        return createErrorResponse("User Not Found", HttpStatus.CONFLICT);
    }
    //checking if same student give exam of their allotment
    Exam_Allotment allotment = examServices.getAllotmentById(allotmentId);
    if (!user.getUsername().equals(allotment.getStudentId().getUser().getUsername())) {
        return createErrorResponse("Please Provide Your Username", HttpStatus.CONFLICT);
    }

    // Verify password
    if (!encoder.matches(user.getPassword(), getUser.getPassword())) {
        return createErrorResponse("Wrong Password", HttpStatus.CONFLICT);
    }

    // Check user is active if student was blocked or not
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

    // Handle login logic add student is apeared or not, setting login Ip address
    return handleLoginLogic(allotment, request, getUser);
}

private ResponseEntity<?> handleLoginLogic(Exam_Allotment allotment, HttpServletRequest request, Users getUser) {
    Exam_Security_log log = allotment.getSecurityLog();

    if (allotment.getIsAppeared()) {
        // Student has already appeared for the exam
    	allotment.setIsAppeared(true);
    	//checking if student login from same ip address
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
//this will create response 
private ResponseEntity<?> createErrorResponse(String message, HttpStatus status) {
    return ResponseEntity.status(status).body(message);
}


//this controller update student used time Calling each minute while exam
@PostMapping("/updateStudentTimer/{allotmentId}")
public ResponseEntity<?> UpdateStudentUsedTime(@RequestBody Map<String,Integer> usedTime,@PathVariable int allotmentId){
		
	if(examServices.updateUsedTime(usedTime.get("time"),allotmentId)) {
		return ResponseEntity.status(HttpStatus.OK).body("Time Updated "+usedTime.get("time"));
		}else {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while Updating Time");
		}
}


//this stored security log for students while exam
@PostMapping("/securityLog/{allotmentId}")
public ResponseEntity<?> securityLog(@PathVariable int allotmentId,@RequestBody Map<String,String> actionType){
		try {
			Exam_Security_log log= examServices.updateSecurityLog(actionType.get("action"),allotmentId);
			return ResponseEntity.status(HttpStatus.OK).body(log);
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while storing security log");
		}
}

//submit exam for student while exam
@GetMapping("/submitExam/{allotmentId}")
public ResponseEntity<?>  submitExam(@PathVariable int allotmentId){
		if(examServices.submitSingleExam(allotmentId)) {
			return ResponseEntity.status(HttpStatus.OK).body("Exam Submited Succefully");
		}else {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while Submiting exam");
		}
}
}
