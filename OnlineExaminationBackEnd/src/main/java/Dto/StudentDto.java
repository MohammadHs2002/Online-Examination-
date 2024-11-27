package Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
	private String username;
    private String password;
    private String name;
    private String unique_id;
    private String program;
    private int semester;
    private String division;
    private int groupid;
    private Long number;
}
