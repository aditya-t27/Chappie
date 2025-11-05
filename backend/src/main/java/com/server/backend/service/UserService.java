package com.server.backend.service;

import com.server.backend.model.User;
import com.server.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static java.util.regex.Pattern.matches;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Signup
    public boolean registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return false; // email already exists
        }

        userRepository.save(user);
        return true;
    }

    // Login
    public boolean validateLogin(String email, String password) {
        User existingUser = userRepository.findByEmail(email);
        return existingUser != null && matches(password, existingUser.getPassword());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Search
    public List<User> searchUserByEmail(String query){
        if(query == null || query.isEmpty()){
            return List.of();  // return empty list
        }
        return userRepository.findByEmailContainingIgnoreCase(query);
    }
}
