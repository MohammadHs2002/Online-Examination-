package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@ComponentScan({"com.example.Service", "com.example.Controller","com.example.config","com.example.Security"})
@EntityScan(basePackages = "com.example.Entity")
@EnableJpaRepositories(basePackages = "com.example.Repository")
@SpringBootApplication
public class OnlineExaminationBackEndApplication {
	public static void main(String[] args) {
		SpringApplication.run(OnlineExaminationBackEndApplication.class, args);
	}

}
