package com.example.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.MCQCategory;
import com.example.Repository.CatagoryRepo;

@Service
public class CategoryServices {

	@Autowired
	private CatagoryRepo catagoryRepo;
	
	public List<MCQCategory> getAllCatagory(){
		return catagoryRepo.findAll();
	}
	
	public MCQCategory getCategoryById(int id) {
		return catagoryRepo.findById(id).orElse(null);
	}
	
	public MCQCategory saveCategory(MCQCategory category) {
		return catagoryRepo.save(category);
	}
	
	public MCQCategory getByCategoryName(String text) {
		return catagoryRepo.findByName(text);
	}
	public void deleteCategory(int id) {
		 catagoryRepo.deleteById(id);
	}
	
	
}
