package com.example.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Entity.Users;
import com.example.Repository.UserRepo;

@Service
public class UserServices {
	
	@Autowired
	private UserRepo userRepo;
	
	public List<Users> getAllUsers(){
		return userRepo.findAll();
	}
	
	public Users getUserById(int userid) {
		return userRepo.findById(userid).orElse(null);
	}
	
	public Users saveUser(Users user) {
		return userRepo.save(user);
	}
	
	public void deleteUser(int userid) {
	    userRepo.deleteById(userid);
	}
	
	public Users loginUser(String username) {
		return userRepo.findByUsername(username);
	}
}
