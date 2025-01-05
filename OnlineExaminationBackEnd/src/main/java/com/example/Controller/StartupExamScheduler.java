package com.example.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.Entity.Exam;
import com.example.Entity.Users;
import com.example.Service.ExamSchedulerService;
import com.example.Service.ExamServices;
import com.example.Service.UserServices;

import jakarta.annotation.PostConstruct;
@Component
public class StartupExamScheduler {

    @Autowired
    private ExamServices examService;

    @Autowired
    private ExamSchedulerService examSchedulerService;

    @Autowired
    private UserServices userServices;
    
    @Autowired BCryptPasswordEncoder passwordEncoder;
    
    //this function schedule every future exam when backend re-starts 
    @PostConstruct
    public void scheduleAllExams() {
        System.out.println("StartupExamScheduler initialized");
        List<Exam> upcomingExams = examService.findUpComingExams();

        if (upcomingExams == null) {
            System.out.println("findUpComingExams() returned null");
        } else {
            System.out.println("Upcoming exams count: " + upcomingExams.size());
        }

        for (Exam exam : upcomingExams) {
            examSchedulerService.scheduleExam(exam);
        }
    }
    //this function set super admin if not exists 
    @PostConstruct
    public void setDefaultAdmin() {
    	if(userServices.getUserByUserName("Admin")==null) {
    		Users u=new Users();
    		u.setUsername("Admin");
    		u.setPassword(passwordEncoder.encode("123"));
    		u.setRole("Admin");
    		userServices.saveUser(u);
    		System.out.println("Default Admin Created Succefully");
    	} 
    }
}
