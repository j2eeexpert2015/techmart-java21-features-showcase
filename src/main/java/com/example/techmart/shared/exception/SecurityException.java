package com.example.techmart.shared.exception;

/**
 * A specialized exception thrown to indicate a security violation, such as
 * unauthorized access or a failed authentication attempt.
 */
public class SecurityException extends TechMartException {

    public SecurityException(String message) {
        super(message);
    }

    public SecurityException(String message, Throwable cause) {
        super(message, cause);
    }
}