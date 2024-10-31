package com.example.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Entity.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {
	public Users findByUsername(String username);
}
