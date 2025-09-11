package com.example.techmart.shared.exception;

import java.util.List;

/**
 * A specialized exception thrown when input data fails business rule validation.
 * It can encapsulate a single message or a list of validation errors.
 */
public class ValidationException extends TechMartException {

    private final List<String> validationErrors;

    public ValidationException(String message) {
        super(message);
        this.validationErrors = List.of(message);
    }

    public ValidationException(List<String> validationErrors) {
        super("Validation failed: " + String.join(", ", validationErrors));
        this.validationErrors = List.copyOf(validationErrors);
    }

    public List<String> getValidationErrors() {
        return validationErrors;
    }
}