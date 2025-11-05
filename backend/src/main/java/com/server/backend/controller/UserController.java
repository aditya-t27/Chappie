package com.server.backend.controller;


import com.server.backend.model.User;
import com.server.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Signup Endpoint
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        boolean success = userService.registerUser(user);

        if (success) {
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Email already registered!");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        boolean valid = userService.validateLogin(user.getEmail(), user.getPassword());

        if (valid) {
            response.put("message", "Login successful!");
            response.put("user", userService.getUserByEmail(user.getEmail()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid email or password!");
            return ResponseEntity.status(401).body(response);
        }
    }   

    // Search Endpoint
    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query){
        List<User> users = userService.searchUserByEmail(query);
        return ResponseEntity.ok(users);
    }
}
