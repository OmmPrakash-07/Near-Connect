package com.nearconnect.backend.controller;

import com.nearconnect.backend.model.User;
import com.nearconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List; // ✅ ADD THIS

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.login(user.getEmail(), user.getPassword());
    }

    @PutMapping("/location/{id}")
    public User updateLocation(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateLocation(id, updatedUser);
    }

    @GetMapping("/nearby")
    public List<User> getNearbyUsers(
            @RequestParam Long userId,
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam(defaultValue = "5") Double radius) {
        return userService.findNearbyUsers(userId, lat, lon, radius);
    }
}