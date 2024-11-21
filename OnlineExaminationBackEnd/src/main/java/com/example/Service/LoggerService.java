package com.example.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.Logger;
import com.example.Entity.Users;
import com.example.Repository.LoggerRepo;
import com.example.Repository.UserRepo;

@Service
public class LoggerService {
	@Autowired
	private LoggerRepo logRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	public List<Logger> getAllLog(){
		return logRepo.findAll();
	}
	
	public Logger saveLog(Logger log) {
		Users user = userRepo.findById(log.getUser().getUserId()).orElseThrow(()->new RuntimeException("user not Found"));
		log.setUser(user);
		return logRepo.save(log);
	}
	
	
}
