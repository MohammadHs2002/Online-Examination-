package com.example.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Entity.Logger;
import com.example.Entity.Users;
import com.example.Service.LoggerService;
import com.example.Service.UserServices;
import com.example.validation.Action;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/log")
public class LoggerController {
	@Autowired
	private LoggerService logService;
	
	//fetching all user login log
	@GetMapping
	public ResponseEntity<?> getAllLog(){
		List<Logger> logs=logService.getAllLog();
		if(logs.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Logs Found");
		}else {
			return ResponseEntity.ok(logs);
		}
	}
	//creating  user login log
	@PostMapping
	public ResponseEntity<?> createLog(@RequestBody Logger log){
		if((log.getIpAddress()!=null || log.getMacAddress()!=null) && log.getUser()!=null) {
		return ResponseEntity.ok(logService.saveLog(log));
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Plese Provide ip,mac,userid");
		}
		
	}
	
	//handling  user logout log
	@PostMapping("logout")
	public ResponseEntity<?>  logoutlog(@RequestBody Users user,HttpServletRequest request){
		Logger log=new Logger();
		log.setUser(user);
		log.setAction(Action.LOGOUT);
		log.setIpAddress(request.getRemoteAddr());
		System.out.println(logService.saveLog(log));
		return ResponseEntity.ok("done");
	}
}
