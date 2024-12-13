package com.example.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.MCQCategory;
import java.util.List;


@Repository
public interface CatagoryRepo extends JpaRepository<MCQCategory, Integer>{
	MCQCategory findByName(String name);
}
