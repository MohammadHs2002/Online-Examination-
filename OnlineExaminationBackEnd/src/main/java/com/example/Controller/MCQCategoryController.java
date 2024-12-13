package com.example.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

import com.example.Entity.MCQCategory;
import com.example.Service.CategoryServices;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/MCQCategory")
public class MCQCategoryController {
	@Autowired
	private CategoryServices categoryServices;
	
	@GetMapping
	public ResponseEntity<?> getAllCategory(){
		List<MCQCategory> categorys=categoryServices.getAllCatagory();
		if(categorys.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Category Found");
		}else {
			return ResponseEntity.status(HttpStatus.OK).body(categorys);
		}
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getCategoryById(@PathVariable int id){
		MCQCategory category=categoryServices.getCategoryById(id);
		if(category==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Category Found by id: "+id);
		}else {
			return ResponseEntity.status(HttpStatus.OK).body(category);
		}
	}
	
	@PostMapping
	public ResponseEntity<?> saveCategory(@RequestBody MCQCategory category){
		if(category.getName()=="" || category.getName()==null) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Plese Provide Category Name");
		}else {
			try {
				if(categoryServices.getByCategoryName(category.getName())!=null) {
					return ResponseEntity.status(HttpStatus.CONFLICT).body("Category Alredy Exists");
				}
				MCQCategory savedCategory=categoryServices.saveCategory(category);
				return ResponseEntity.status(HttpStatus.OK).body(savedCategory);
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem Saving Category");
			}
		}
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateCategory(@PathVariable int id,@RequestBody MCQCategory category){
		MCQCategory existingCategory=categoryServices.getCategoryById(id);
		if(existingCategory==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Category Found");
		}else {
			try {
			if(existingCategory.getName()!=category.getName() && category.getName()!="" && category.getName()!=null) {
				existingCategory.setName(category.getName());
				return ResponseEntity.status(HttpStatus.OK).body(categoryServices.saveCategory(existingCategory));
			}else return ResponseEntity.status(HttpStatus.CONFLICT).body("Category name must be unique / provide category name");
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Problem Updating Category");
			}
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCategory(@PathVariable int id){
		if(categoryServices.getCategoryById(id)!=null) {
			categoryServices.deleteCategory(id);
			return ResponseEntity.status(HttpStatus.OK).body("Category with id :"+id+" Deleted Succefully");
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with id :"+id+" Not Found");
		}
	}
	
	@PostMapping("/deleteMultiple")
	public ResponseEntity<?> deleteCategory(@RequestBody List<MCQCategory> categorys){
		try {
			for(MCQCategory category:categorys) {
				categoryServices.deleteCategory(category.getId());
			}
			return ResponseEntity.status(HttpStatus.OK).body("Categorys Deleted Succefully");
		}catch(Exception e) {
			System.out.println(e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Problem Deleteting Multiple Category");
		}

	}
}
