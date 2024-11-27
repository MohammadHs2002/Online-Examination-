package com.example.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Entity.Student;
import com.example.Entity.Users;





@Repository
public interface StudentRepo extends JpaRepository<Student, Integer> {
    @Query("SELECT s FROM Student s WHERE s.unique_id = :uniqueId")
    Student findByUniqueId(@Param("uniqueId") String uniqueId);

    Student findByUser(Users user);
    
    Student findByNumber(Long number);
}
