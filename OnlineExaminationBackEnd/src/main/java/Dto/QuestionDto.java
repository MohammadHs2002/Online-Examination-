package Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
		private String text;
		private String dificulty;
		private int categoryId;
		private String option1;
		private String option2;
		private String option3;
		private String option4;
		private String answer;
}
