package com.traceback.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import org.springframework.validation.FieldError;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleResourceNotFoundException(ResourceNotFoundException ex){
        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());
        error.put("status", HttpStatus.NOT_FOUND.value());
        error.put("timestamp", LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<Map<String,Object>> handleUnauthorizedActionException(UnauthorizedActionException ex){
        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());
        error.put("status", HttpStatus.FORBIDDEN.value());
        error.put("timestamp", LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> handleIllegalArgumentException(IllegalArgumentException ex){
        Map<String, Object> error = new HashMap<>();
        error.put("message", ex.getMessage());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("timestamp", LocalDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("timestamp", LocalDateTime.now());
        
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((e) -> {
            String fieldName = ((FieldError) e).getField();
            String errorMessage = e.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        error.put("errors", fieldErrors);
        error.put("message", "Validation failed");
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
