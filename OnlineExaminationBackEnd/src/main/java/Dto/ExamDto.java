package Dto;

import java.time.LocalDateTime;
import com.example.Entity.Question.Difficulty;
import com.example.Entity.Exam.ExamType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExamDto {
    private String examName;
    private LocalDateTime examStartDateTime;
    private Integer examDuration;
    @Enumerated(EnumType.STRING)
    private ExamType examType; 
    @Enumerated(EnumType.STRING)
    private Difficulty examDifficulty;
    private int studentGroup;
    private Integer numberOfQuestions;
    private Integer totalMarks;
    private Integer passingMarks;
    private int mcqCategorie;
}
