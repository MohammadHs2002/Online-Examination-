package com.example.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.Group;
import com.example.Entity.Student;
import com.example.Entity.Users;
import com.example.Repository.StudentRepo;
import com.example.Repository.UserRepo;

@Service
public class StudentService {
	@Autowired
	private StudentRepo studentRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	public List<Student> getAllStudent(){
		return studentRepo.findAll();
	}
	
	public Student getStudentById(int id) {
		return studentRepo.findById(id).orElse(null);
	}
	
	public Student saveStudent(Student student) {
		return studentRepo.save(student);
	}
	
	public void deleteStudent(int id) {
		 studentRepo.deleteById(id);
	}
	
	public Student findByUniqueId(String id) {
		return studentRepo.findByUniqueId(id);
	}
	
	public Student findByUser(int  id) {
		Users user=userRepo.findById(id).get();
		return studentRepo.findByUser(user);
	}
	
	public Student findByNumber(Long number) {
		return studentRepo.findByNumber(number);
	}
	
	public List<Student> getStudentByGroupId(Group group){
		return studentRepo.findByGroup(group);
	}
}
