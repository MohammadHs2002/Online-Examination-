package com.example.demo;

import jakarta.persistence.*;

@Entity
public class demo {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;
	private String username;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	
}
