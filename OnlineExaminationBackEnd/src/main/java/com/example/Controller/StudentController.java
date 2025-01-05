package com.example.Controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
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
import org.springframework.web.multipart.MultipartFile;

import com.example.Entity.Group;
import com.example.Entity.Student;
import com.example.Entity.Users;
import com.example.Service.GroupService;
import com.example.Service.StudentService;
import com.example.Service.UserServices;
import com.opencsv.CSVReader;

import Dto.StudentDto;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/student")
public class StudentController {

	@Autowired
	private StudentService studentService;
	
	@Autowired
	private UserServices userService;
	
	@Autowired
	private GroupService groupService;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	//fetch all student
	@GetMapping
	public ResponseEntity<?> getAllStudent() {
		List<Student> student=studentService.getAllStudent();
		if(student.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No student Found");
		}
		return ResponseEntity.ok(student);
	}
	//fetch  student with id
	@GetMapping("/{id}")
	public ResponseEntity<?> getStudentById(@PathVariable int id) {
		Student student=studentService.getStudentById(id);
		if(student==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Student Found by id : "+id);
		}
		return ResponseEntity.ok(student);
	}
	
	//create new student
	@PostMapping
	public ResponseEntity<?> createStudent(@RequestBody StudentDto student) {
		System.out.print(student);
	    // Validate mandatory fields
	    if (student.getUsername() == null || student.getUsername().isEmpty() ||
	        student.getPassword() == null || student.getPassword().isEmpty() ||
	        student.getName() == null || student.getName().isEmpty() ||
	        student.getUnique_id() == null || student.getUnique_id().isEmpty() ||
	        student.getGroupid() == 0) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Please provide username, unique ID, password, name, and group ID.");
	    }
	    if(studentService.findByNumber(student.getNumber())!=null) {
	    	return ResponseEntity.status(HttpStatus.CONFLICT)
	                .body("Mobile No already taken.");
	    }
	    // Check if username already exists
	    if (userService.getUserByUserName(student.getUsername()) != null) {
	        return ResponseEntity.status(HttpStatus.CONFLICT)
	                .body("Username already taken.");
	    }

	    // Check if unique ID already exists
	    if (studentService.findByUniqueId(student.getUnique_id()) != null) {
	        return ResponseEntity.status(HttpStatus.CONFLICT)
	                .body("Unique ID already exists.");
	    }

	    // Check if group exists
	    Group group = groupService.getGroupById(student.getGroupid());
	    if (group==null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Group with the given ID does not exist.");
	    }

	    try {
	        // Create and save user
	        Users user = new Users();
	        user.setUsername(student.getUsername());
	        user.setPassword(bCryptPasswordEncoder.encode(student.getPassword()));
	        user.setRole("Student");
	        Users newUser = userService.saveUser(user);

	        // Create and save student
	        Student newStudent = new Student();
	        newStudent.setName(student.getName());
	        newStudent.setUnique_id(student.getUnique_id());
	        newStudent.setSemester(student.getSemester());
	        newStudent.setProgram(student.getProgram());
	        newStudent.setDivision(student.getDivision());
	        newStudent.setUser(newUser);
	        newStudent.setGroup(group);
	        newStudent.setNumber(student.getNumber());
	        Student savedStudent = studentService.saveStudent(newStudent);

	        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
	    } catch (Exception e) {
	        e.printStackTrace(); // For debugging, replace with logger in production
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Something went wrong. Please try again.");
	    }
	}

	//update student controller
	@PutMapping("/{id}")
	public ResponseEntity<?> updateStudent(@PathVariable int id, @RequestBody StudentDto student) {
		Student existingStudent=studentService.getStudentById(id);
		Users user=existingStudent.getUser();
		user.setUserId(existingStudent.getUser().getUserId());
		if(studentService.findByUniqueId(student.getUnique_id())!=null && !existingStudent.getUnique_id().equals(student.getUnique_id())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Unique id Not Available");
		}
		existingStudent.setUnique_id(student.getUnique_id());
		System.out.println(userService.getUserByUserName(student.getUsername()));
		if(userService.getUserByUserName(student.getUsername())!=null && !existingStudent.getUser().getUsername().equals(student.getUsername())) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("UserName not Available");
		}
		user.setUsername(student.getUsername());
		
		if(student.getPassword()!="") {
				System.out.println("Password Changes");
				user.setPassword(bCryptPasswordEncoder.encode(student.getPassword()));
		}
		
		existingStudent.setName(student.getName());
		existingStudent.setProgram(student.getProgram());
		existingStudent.setSemester(student.getSemester());
		existingStudent.setDivision(student.getDivision());
		existingStudent.setNumber(student.getNumber());
		existingStudent.setGroup(groupService.getGroupById(student.getGroupid()));
		
		try {
			userService.saveUser(user);
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somthing went wrong while updating user");
		}
		
		try {
		return ResponseEntity.ok(studentService.saveStudent(existingStudent));
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somthing went wrong while updating Student");
		}
	}
	
	//deleting student with id
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteStudent(@PathVariable int id){
		Student student=studentService.getStudentById(id);
		if(student!=null) {
			studentService.deleteStudent(id);
			return ResponseEntity.ok("Student with id:"+id+" Deleted Successfully");
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Student found by id :"+id);
		}
	}
	
	//deleting multiple student
	@PostMapping("/multiple")
	public ResponseEntity<?> deleteMultipleStudent(@RequestBody List<Student> students){
		try {
			for(Student student:students) {
				studentService.deleteStudent(student.getId());
			}
			return ResponseEntity.status(HttpStatus.OK).body("Selected Student Deleted Successfully");
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Somthing went wrong while Deleting student");
		}
	}
	
	//creating multple student with csv upload
    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCsv(@RequestParam("file") MultipartFile file, @RequestParam("groupId") int groupId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }
        int  count=0;
        String ErrorMessage="";
        boolean isError=false;
        // Process the file and convert to a list of StudentDto
        List<StudentDto> students=null;
		try {
			students = processCsvToStudentDto(file);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somthing went wrong while procecing File");
		}
		Users newUser=new Users();
		
		for(StudentDto student:students){
			String message=checkStudentDetailes(student);
			if(message!="") {
				ErrorMessage+="Unique Id: "+student.getUnique_id()+" Error:"+message+";";
				isError=true;
			}else {
					try {
						Users user = new Users();
				        user.setUsername(student.getUsername());
				        user.setPassword(student.getPassword());
				        user.setRole("Student");
				        newUser = userService.saveUser(user);
					}catch(Exception e) {
						ErrorMessage+="Unique Id: "+student.getUnique_id()+" Error:"+e.getMessage()+";";
						continue;
					}
					try {
				        // Create and save student
				        Student newStudent = new Student();
				        newStudent.setName(student.getName());
				        newStudent.setUnique_id(student.getUnique_id());
				        newStudent.setSemester(student.getSemester());
				        newStudent.setProgram(student.getProgram());
				        newStudent.setDivision(student.getDivision());
				        newStudent.setUser(newUser);
				        newStudent.setGroup(groupService.getGroupById(groupId));
				        newStudent.setNumber(student.getNumber());
				        Student savedStudent = studentService.saveStudent(newStudent);
				        count++;
					}catch(Exception e) {
						userService.deleteUser(newUser.getUserId());
						ErrorMessage+="Unique Id: "+student.getUnique_id()+" Error:"+e.getMessage()+";";
					}
			}
		}
		if(isError) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
	            "error", ErrorMessage,"recordInserted", count
	            ));
        // Return the number of records processed
        return ResponseEntity.ok("File processed successfully. Number of records: " + students.size());
    }

    //read csv file and covert it to studen list
    private List<StudentDto> processCsvToStudentDto(MultipartFile file) throws Exception {
        List<StudentDto> students = new ArrayList<>();
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
                String name = nextLine[0];
                String uniqueId = nextLine[1];
                String program = nextLine[2];
                int semester = Integer.parseInt(nextLine[3]);
                String division = nextLine[4];
                Long number = Long.parseLong(nextLine[5]);
                
                // Generate username and password based on unique_id and mobile_no (last 7 digits)
                String username = uniqueId;
                String password = number.toString().substring( number.toString().length()- 7);
                // Create and populate the StudentDto object
                StudentDto student = new StudentDto();
                student.setUsername(username);
                student.setPassword(bCryptPasswordEncoder.encode(password));
                student.setName(name);
                student.setUnique_id(uniqueId);
                student.setProgram(program);
                student.setSemester(semester);
                student.setDivision(division);
                student.setNumber(number);

                students.add(student);
            }

        } catch (IOException e) {
            e.printStackTrace();
            // Handle IOException here
        }

        return students;
    }
    
    //validating student details
    private String checkStudentDetailes(StudentDto student) {
    	String ErrorMessage="";
    	if(student.getNumber().toString().length()!=10) {
    		ErrorMessage+="Mobile No Must  be 10 Digit"+",";
    	}
    	if(studentService.findByUniqueId(student.getUnique_id())!=null) {
    		ErrorMessage+="Unique Id Alredy Exists"+",";
    	}
    	if(studentService.findByNumber(student.getNumber())!=null) {
    		ErrorMessage+="Mobile Number Alredy Taken";
    	}
    	return ErrorMessage;
    }
}
