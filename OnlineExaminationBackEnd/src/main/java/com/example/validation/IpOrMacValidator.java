package com.example.validation;

import com.example.Entity.Logger;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IpOrMacValidator implements ConstraintValidator<IpOrMacNotNull,Logger>{
		@Override
		public boolean isValid(Logger logger,ConstraintValidatorContext context) {
			return logger.getIpAddress()!=null || logger.getMacAddress()!=null;
		}
}
