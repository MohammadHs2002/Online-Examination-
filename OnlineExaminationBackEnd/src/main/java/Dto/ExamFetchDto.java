package Dto;

import com.example.Entity.Exam;
import com.example.Entity.Exam_Allotment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExamFetchDto {
	private Exam exam;
	private Exam_Allotment allotment;
}
