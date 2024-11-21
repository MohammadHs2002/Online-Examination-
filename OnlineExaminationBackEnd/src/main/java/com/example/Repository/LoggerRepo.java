package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Logger;
@Repository
public interface LoggerRepo extends JpaRepository<Logger, Integer>{
	
}
