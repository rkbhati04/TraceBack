package com.traceback.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.traceback.backend.exception.ResourceNotFoundException;
import com.traceback.backend.model.User;
import com.traceback.backend.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User findUserOrThrow(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    public User registerUser(User user) {
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public List<User> getUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
        return findUserOrThrow(id);
    }

    public User getUserByUsername(String username) {
        return repo.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username " + username));
    }

    public User getUserByEmail(String email) {
        return repo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
    }

    public User updateUser(Long id, User newUserDetails) {
        User user = findUserOrThrow(id);
        
        user.setEmail(newUserDetails.getEmail());
        user.setPhoneNumber(newUserDetails.getPhoneNumber());
        user.setRole(newUserDetails.getRole());
        
        return repo.save(user);
    }

    public void deleteUser(Long id) {
        User user = findUserOrThrow(id);
        repo.delete(user);
    }
}
