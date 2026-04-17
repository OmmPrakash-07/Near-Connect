package com.nearconnect.backend.service;

import com.nearconnect.backend.model.User;
import com.nearconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public User updateLocation(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow();
        user.setLatitude(updatedUser.getLatitude());
        user.setLongitude(updatedUser.getLongitude());
        return userRepository.save(user);
    }

    // 🔥 Distance Logic
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // 🔥 Nearby Users Logic
    public List<User> findNearbyUsers(Long currentUserId, Double lat, Double lon, Double radius) {
        List<User> allUsers = userRepository.findAll();

        return allUsers.stream()
                .filter(user -> user.getId() != currentUserId) // ❌ remove self
                .filter(user -> user.getLatitude() != null && user.getLongitude() != null)
                .filter(user -> {
                    double distance = calculateDistance(lat, lon, user.getLatitude(), user.getLongitude());
                    return distance <= radius;
                })
                .toList();
    }
}