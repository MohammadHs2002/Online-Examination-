package com.example.Entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.ManyToAny;

import com.example.validation.Action;
import com.example.validation.IpOrMacNotNull;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="logger")
@IpOrMacNotNull
public class Logger {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "logger_id")
	private int loggerId;
	@Column(name="ip")
	private String ipAddress;
	@Column(name="mac")
	private String macAddress;
	
	@Column(name="Action",nullable=false)
	@Enumerated(EnumType.STRING)
	private Action action;
	@CreationTimestamp
	@Column(name="created_at",nullable = false)
	private LocalDateTime createdAt;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", nullable = false)
	@JsonBackReference("user-logger")
	private Users user;
}
