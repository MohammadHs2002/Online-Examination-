package com.example.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Entity.Group;
import com.example.Repository.GroupRepo;

@Service
public class GroupService {
	@Autowired
	private GroupRepo groupRepo;
	
	public List<Group> getAllGroup(){
		return groupRepo.findAll();
		
	}
	
	public Group getGroupById(int id){
		return groupRepo.findById(id).orElse(null);
	}
	
	public Group saveGroup(Group group) {
		return groupRepo.save(group);
	}
	
	public void deleteGroup(int id) {
		 groupRepo.deleteById(id);
	}

	public Group getGroupByName(String name) {
		return groupRepo.findByName(name);
	}
}
