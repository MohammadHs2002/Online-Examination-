package com.example.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = IpOrMacValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface IpOrMacNotNull {
	String message() default "Eigther ipAddress of macAddress must be Provided";
	Class<?>[] group() default{};
	Class<? extends Payload>[] payload() default{};
}
