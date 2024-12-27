package com.example.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.Exam;
import com.example.Entity.Exam.ExamStatus;
import com.example.Entity.Exam.ExamType;
import com.example.Entity.Exam_Allotment;
import com.example.Entity.Exam_Answer;
import com.example.Entity.Exam_Questions;
import com.example.Entity.Exam_Result;
import com.example.Entity.Exam_Security_log;
import com.example.Entity.ProgramingQuestion;
import com.example.Entity.Question;
import com.example.Entity.Student;
import com.example.Entity.Users;
import com.example.Repository.AllotmentRepo;
import com.example.Repository.ExamAnswerRepo;
import com.example.Repository.ExamQuestionRepo;
import com.example.Repository.ExamRepo;
import com.example.Repository.ExamResultRepo;
import com.example.Repository.ExamSecurityRepo;
import com.example.Repository.GroupRepo;
import com.example.Repository.ProgramingQuestionRepo;
import com.example.Repository.QuestionRepo;
import com.example.Repository.StudentRepo;

import Dto.ExamFetchDto;

@Service
public class ExamServices {
	@Autowired
	private ExamRepo examRepo;
	
	@Autowired
	private AllotmentRepo allotmentRepo;
	
	@Autowired
	private StudentRepo studentRepo;
	
	@Autowired
	private QuestionRepo questionRepo;
	
	@Autowired
	private GroupRepo groupRepo;
	
	@Autowired
	private ExamQuestionRepo examQuestionRepo;
	
	
	@Autowired
	private ProgramingQuestionRepo programingRepo;
	
	@Autowired
	private ExamResultRepo examResultRepo;
	
	@Autowired
	private ExamSecurityRepo examSecurityRepo;
	
	
	@Autowired
	private ExamAnswerRepo examAnswerRepo;
	
	public List<Exam> getAllExams(){
		return  examRepo.findAll();
	}
	
	public List<ExamFetchDto> getAllAllotments(){
		List<ExamFetchDto> dto=new ArrayList<>();
		for(Exam_Allotment e:allotmentRepo.findAll()) {
			ExamFetchDto d=new ExamFetchDto();
			d.setExam(e.getExam());
			d.setAllotment(e);
			dto.add(d);
		}
		return dto;
	}
	
	public void deleteAllotments(Exam_Allotment allotment) {
		 allotmentRepo.deleteById(allotment.getAllotmentId());
	}
	
	public Exam getExamById(Integer id) {
		return examRepo.findById(id).orElse(null);
	}
	
	public Exam saveExam(Exam e) {
		return examRepo.save(e);
	}
	
	public List<Exam_Allotment> saveAllotments(Exam e,Integer groupId){
		List<Student> students=studentRepo.findByGroup(groupRepo.findById(groupId).get());
		List<Exam_Allotment> allotments=new ArrayList<Exam_Allotment>();
		for(Student s:students) {
			Exam_Allotment allotment=new Exam_Allotment();
			allotment.setExam(e);
			allotment.setStudentId(s);
			allotments.add(allotmentRepo.save(allotment));
		}
		return allotments;
	}
	
	
	public List<Exam_Questions> saveMappedQuestion(Exam e){
		List<Exam_Questions> examQuestions=new ArrayList<Exam_Questions>();
		if(e.getExamType().equals(ExamType.MCQ)) {
			List<Question> questions= questionRepo.findByCatagory(e.getMcqCategorie());
			List<Question> filteredQuestion=questions.stream().filter(que -> que.getDifficulty().equals(e.getExamDifficulty())).collect(Collectors.toList()); 
			List<Question> selectedQuestions=filteredQuestion.subList(0, e.getNumberOfQuestions());
			for(Question q:selectedQuestions) {
				Exam_Questions newQuestion=new Exam_Questions();
				newQuestion.setExam(e);
				newQuestion.setMcqQuestion(q);
				examQuestions.add(examQuestionRepo.save(newQuestion));
			}
		}else {
			List<ProgramingQuestion> programingQuestion=programingRepo.findByDifficulty(e.getExamDifficulty());
			Collections.shuffle(programingQuestion);
			List<ProgramingQuestion> selectedProgramingQuestion=programingQuestion.subList(0, e.getNumberOfQuestions());
			for(ProgramingQuestion q:selectedProgramingQuestion) {
				Exam_Questions newQuestion=new Exam_Questions();
				newQuestion.setExam(e);
				newQuestion.setProgramQuestion(q);
				examQuestions.add(examQuestionRepo.save(newQuestion));
			}
		}
		return examQuestions;
	}
	
	public List<Exam_Answer> saveExamAnswer(List<Exam_Questions> examQuestion,List<Exam_Allotment> allotments){
		List<Exam_Answer> examAnswerList=new ArrayList<Exam_Answer>();
		for(Exam_Allotment a:allotments) {
			for(Exam_Questions q:examQuestion) {
				Exam_Answer answer=new Exam_Answer();
				answer.setAllotment(a);
				answer.setQuestion(q);
				examAnswerList.add(examAnswerRepo.save(answer));
			}
		}
		return examAnswerList;
	} 
	
	public void saveAllotment_Results_SecurtyLog(List<Exam_Allotment> allotments) {
		for(Exam_Allotment a:allotments) {
			Exam_Result result=new Exam_Result();
			Exam_Security_log log=new Exam_Security_log();
			result.setAllotment(a);
			log.setAllotment(a);
			examResultRepo.save(result);
			examSecurityRepo.save(log);
		}
	}
	
	
	public void deleteExamById(Integer id) {
		examRepo.deleteById(id);
	}
	
	public void deleteAllotmentById(Integer id) {
		allotmentRepo.deleteById(id);
	}
	
	public Integer checkQuestionAvailibility(Exam e) {
		if(e.getExamType().equals(ExamType.MCQ)) {
		List<Question> questions= questionRepo.findByCatagory(e.getMcqCategorie());
		List<Question> filteredQuestion=questions.stream().filter(que -> que.getDifficulty().equals(e.getExamDifficulty())).collect(Collectors.toList()); 
		return filteredQuestion.size();
		}else {
			List<ProgramingQuestion> filteredQuestion=programingRepo.findByDifficulty(e.getExamDifficulty());
			return filteredQuestion.size();
		}
	}
	
	public List<Exam> findUpComingExams(){
		List<Exam> upcomingExam=new ArrayList<>();
		for(Exam e:examRepo.findAll()) {
			LocalDateTime examDate = e.getExamStartDateTime();
			LocalDateTime currentDate = LocalDateTime.now();
			if(e.getStatus().equals(ExamStatus.Scheduled) && examDate.isAfter(currentDate))upcomingExam.add(e);
		}
		return upcomingExam;
	}
	
	
	public List<ExamFetchDto> getAllExamsByUser(Users user){
		Student student=studentRepo.findByUser(user);
		List<ExamFetchDto> exams=new ArrayList<>();
		List<Exam_Allotment> allotments=allotmentRepo.findByStudentId(student);
		for(Exam_Allotment a:allotments) {
			ExamFetchDto dto=new ExamFetchDto();
			dto.setExam(a.getExam());
			dto.setAllotment(a);
			exams.add(dto);
		}
		return exams;
	}
	
	
	public Exam_Allotment getAllotmentById(int id) {
		return allotmentRepo.findById(id).orElse(null);
	}
	
	public Exam_Security_log updateSecurityLog(Exam_Security_log log) {
		return examSecurityRepo.save(log);
	}
	
	public Exam_Allotment updateAllotment(Exam_Allotment allotment) {
		return allotmentRepo.save(allotment);
	}
}
