package com.transport.backend.controller;

import com.transport.backend.model.User;
import com.transport.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS
})
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. Email/Password Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String fullName = request.get("fullName");
        String password = request.get("password");
        String phone = request.get("phone");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and Password are required"));
        }

        if (userRepository.existsByEmail(email.trim().toLowerCase())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered! Please sign in."));
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(password); // In production, hash with BCryptPasswordEncoder
        user.setPhone(phone);
        user.setAuthProvider("LOCAL");
        user.setRole("PASSENGER");

        User saved = userRepository.save(user);
        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully",
            "user", saved,
            "token", "JWT-" + UUID.randomUUID().toString()
        ));
    }

    // 2. Email/Password Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please provide email and password"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password credentials"));
        }

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "user", user,
            "token", "JWT-" + UUID.randomUUID().toString()
        ));
    }

    // 3. Google OAuth Single-Sign-On Login / Sign-Up
    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String picture = request.get("picture");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Google email is required"));
        }

        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(cleanEmail);
            newUser.setFullName(name != null ? name : "Google Passenger");
            newUser.setProfilePictureUrl(picture);
            newUser.setAuthProvider("GOOGLE");
            newUser.setRole("PASSENGER");
            return userRepository.save(newUser);
        });

        if (picture != null && user.getProfilePictureUrl() == null) {
            user.setProfilePictureUrl(picture);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of(
            "message", "Google Authentication Successful",
            "user", user,
            "token", "JWT-GOOGLE-" + UUID.randomUUID().toString()
        ));
    }
}