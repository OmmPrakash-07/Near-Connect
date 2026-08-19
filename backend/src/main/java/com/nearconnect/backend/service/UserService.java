package com.nearconnect.backend.service;

import com.nearconnect.backend.dto.LocationRequest;
import com.nearconnect.backend.dto.ProfileUpdateRequest;
import com.nearconnect.backend.dto.UserView;
import com.nearconnect.backend.exception.ApiException;
import com.nearconnect.backend.model.Swipe;
import com.nearconnect.backend.model.User;
import com.nearconnect.backend.repository.SwipeRepository;
import com.nearconnect.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SwipeRepository swipeRepository;

    public UserService(UserRepository userRepository, SwipeRepository swipeRepository) {
        this.userRepository = userRepository;
        this.swipeRepository = swipeRepository;
    }

    @Transactional
    public UserView updateLocation(User user, LocationRequest request) {
        if (request.latitude() == null || request.longitude() == null ||
                request.latitude() < -90 || request.latitude() > 90 ||
                request.longitude() < -180 || request.longitude() > 180) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "A valid latitude and longitude are required.");
        }
        user.setLatitude(request.latitude());
        user.setLongitude(request.longitude());
        return UserView.from(userRepository.save(user));
    }

    @Transactional
    public UserView updateProfile(User user, ProfileUpdateRequest request) {
        String name = clean(request.name());
        if (name.length() < 2 || name.length() > 80) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name must be between 2 and 80 characters.");
        }
        user.setName(name);
        user.setBio(limit(clean(request.bio()), 500));
        user.setMood(limit(clean(request.mood()), 80));
        return UserView.from(userRepository.save(user));
    }

    public List<UserView> findNearbyUsers(User currentUser, double radius) {
        if (currentUser.getLatitude() == null || currentUser.getLongitude() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Add your location before discovering people nearby.");
        }
        if (radius < 1 || radius > 100) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Search radius must be between 1 and 100 km.");
        }

        Set<Long> alreadySeen = swipeRepository.findByUserId(currentUser.getId()).stream()
                .map(Swipe::getTargetUserId)
                .collect(Collectors.toSet());

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .filter(user -> !alreadySeen.contains(user.getId()))
                .filter(user -> user.getLatitude() != null && user.getLongitude() != null)
                .map(user -> UserView.from(user, roundedDistance(
                        currentUser.getLatitude(), currentUser.getLongitude(),
                        user.getLatitude(), user.getLongitude())))
                .filter(user -> user.distanceKm() <= radius)
                .sorted(Comparator.comparing(UserView::distanceKm))
                .toList();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private double roundedDistance(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(distance * 10.0) / 10.0;
    }

    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String limit(String value, int max) { return value.length() <= max ? value : value.substring(0, max); }
}
