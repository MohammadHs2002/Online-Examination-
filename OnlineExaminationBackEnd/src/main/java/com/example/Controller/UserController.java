package com.example.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
import org.springframework.web.bind.annotation.RestController;

import com.example.Entity.Users;
import com.example.Service.UserServices;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	private UserServices userServices;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	
	//getting user
	@GetMapping
	public ResponseEntity<?> getAllUsers() {
	    List<Users> users = userServices.getAllUsers();
	    
	    if (users.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	        		.body("No Data Found");
	    } else {
	        return ResponseEntity.ok(users);
	    }
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserByid(@PathVariable int id){
		Users user=userServices.getUserById(id);
		if(user==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("user with id "+id+" not Found");
		}else {
			
			return ResponseEntity.ok(user);
		}
	}
	
	
	//save user
	
	@PostMapping
	public ResponseEntity<?> createUser(@RequestBody Users user) {
	    if (user.getUsername() == null || user.getUsername().isEmpty() || 
	        user.getPassword() == null || user.getPassword().isEmpty() || 
	        user.getRole() == null || user.getRole().isEmpty()) {
	        
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Please provide all required user data.");
	    }
	    //validating user
	    if (!isValidRole(user.getRole())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body("Role must be 'Admin' or 'Student'.");
	    }
	    
	    // Encoding passsword
	    user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
	    	
	    try {
	        userServices.saveUser(user); // This  throw an exception if  username  not unique
	    } catch (DataIntegrityViolationException e) {
	        return ResponseEntity.status(HttpStatus.CONFLICT)
	                .body("Username already exists. Please choose another one.");
	    }
	    
	    return ResponseEntity.status(HttpStatus.CREATED)
	            .body(user);
	}

	//validate user method
	private boolean isValidRole(String role) {
	    return role.equals("Admin") || role.equals("Student");
	}
	
	
	//updating user
	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable int id,@RequestBody Users user) {
		if(userServices.getUserById(id)==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("User with id "+id+" not found");
		}else {
		    Users existingUser = userServices.getUserById(id);
		    
		    if (existingUser == null) {
		        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + id + " not found.");
		    }

		    // Ensure you are not setting required fields to null
		    if (user.getUsername() != null) {
		        existingUser.setUsername(user.getUsername());
		    }
		    if (user.getRole() != null) {
		        existingUser.setRole(user.getRole());
		    }
		    // If you want to update password only when provided
		    if (user.getPassword() != null && !user.getPassword().isEmpty()) {
		        existingUser.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		    }
		    
		    if(!(user.isActive()==existingUser.isActive())) {
		    	existingUser.setActive(user.isActive());
		    }
		    
		    userServices.saveUser(existingUser);
		    return ResponseEntity.ok(existingUser);
		}
	}
	
	//delete user
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable int id){
		if(userServices.getUserById(id)==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("user with id "+id+" not Found");
		}else {
			userServices.deleteUser(id);
			return ResponseEntity.ok()
					.body("User Deleted Succefully");
		}
	}

	
	@PostMapping("/Login")
	public ResponseEntity<?> LoginUser(@RequestBody Users user){
		Users getUser=userServices.loginUser(user.getUsername());
//		System.out.println(user.getUsername()+" "+user.getPassword());
		if(getUser!=null) {
			if(bCryptPasswordEncoder.matches(user.getPassword(), getUser.getPassword())) {
				if(getUser.isActive()) {
				return ResponseEntity.status(HttpStatus.OK)
						.body(getUser);
				}else {
					return ResponseEntity.status(HttpStatus.LOCKED)
							.body("User Bocked");
				}
			}else {
				return ResponseEntity.status(HttpStatus.FORBIDDEN)
						.body("Wrong Password");
			}
		}else {
			return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("User Not Found");
		}		
	}

	
	//making login funcnality
	//return ResponseEntity.ok(bCryptPasswordEncoder.matches("123", user.getPassword()));
	
}
