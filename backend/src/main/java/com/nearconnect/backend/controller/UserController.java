package com.nearconnect.backend.controller;

import com.nearconnect.backend.dto.*;
import com.nearconnect.backend.model.User;
import com.nearconnect.backend.service.AuthService;
import com.nearconnect.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    public UserController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.logout(authorization);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public UserView me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return UserView.from(authService.requireUser(authorization));
    }

    @PutMapping("/me/location")
    public UserView updateLocation(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody LocationRequest request) {
        return userService.updateLocation(authService.requireUser(authorization), request);
    }

    @PutMapping("/me/profile")
    public UserView updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody ProfileUpdateRequest request) {
        return userService.updateProfile(authService.requireUser(authorization), request);
    }

    @GetMapping("/nearby")
    public List<UserView> getNearbyUsers(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(defaultValue = "10") double radius) {
        User currentUser = authService.requireUser(authorization);
        return userService.findNearbyUsers(currentUser, radius);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "near-connect");
    }
}
