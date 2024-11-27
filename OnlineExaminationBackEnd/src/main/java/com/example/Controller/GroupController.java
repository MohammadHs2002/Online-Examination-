package com.example.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Entity.Group;
import com.example.Service.GroupService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/group")
public class GroupController {
	@Autowired
	private GroupService groupService;
	
	@GetMapping
	public ResponseEntity<?> getAllGroups() {
		List<Group> groups=groupService.getAllGroup();
		if(groups.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Group Found");
		}
		return ResponseEntity.ok(groups);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getGroupsById(@PathVariable int id) {
		Group groups=groupService.getGroupById(id);
		if(groups==null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Group Found by id : "+id);
		}
		return ResponseEntity.ok(groups);
	}
	
	@PostMapping
	public ResponseEntity<?> createGroup(@RequestBody Group group){
		if(group.getName()!=null) {
			if(groupService.getGroupByName(group.getName())!=null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provided Group Name Alredy Exist");
			}
			Group newGroup=groupService.saveGroup(group);
			return ResponseEntity.ok(newGroup);
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Plese Provide Group Name");
		}
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateGroup(@PathVariable int id, @RequestBody Group group) {
		Group existingGroup=groupService.getGroupById(id);
		if(existingGroup!=null) {
			if(group.getName()!=null) {
				if(!existingGroup.getName().equals(group.getName()))
				if(groupService.getGroupByName(group.getName())!=null) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provided Group Name Alredy Exist");
				}
				existingGroup.setName(group.getName());
			}
			return ResponseEntity.ok(groupService.saveGroup(existingGroup));
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Group found by id :"+id);
		}
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteGroup(@PathVariable int id){
		Group existingGroup=groupService.getGroupById(id);
		if(existingGroup!=null) {
			groupService.deleteGroup(id);
			return ResponseEntity.ok("Group with id:"+id+" Deleted Successfully");
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Group found by id :"+id);
		}
	}
}
