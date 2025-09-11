package com.example.techmart.shared.exception;

/**
 * Base exception for all TechMart business logic exceptions.
 */
public class TechMartException extends RuntimeException {
    
    public TechMartException(String message) {
        super(message);
    }
    
    public TechMartException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public TechMartException(Throwable cause) {
        super(cause);
    }
}
