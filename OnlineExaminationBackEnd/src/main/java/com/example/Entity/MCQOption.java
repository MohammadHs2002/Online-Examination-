package com.example.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="MCQOption")
public class MCQOption {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int option_id;
	
	@Column(nullable = false)
	private String text;
	
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="Id",nullable = false)
	@JsonBackReference("mcq-option")
	private Question question;
	
	@Column(nullable = false)
	private boolean isCorrect=false;
}
