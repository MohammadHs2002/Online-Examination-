package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Group;

@Repository
public interface GroupRepo extends JpaRepository<Group, Integer>{
	Group  findByName(String name);
}
