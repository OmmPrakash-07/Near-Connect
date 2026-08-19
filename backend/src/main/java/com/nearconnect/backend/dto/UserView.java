package com.nearconnect.backend.dto;

import com.nearconnect.backend.model.User;

public record UserView(
        Long id,
        String name,
        String bio,
        String mood,
        Double latitude,
        Double longitude,
        String avatarColor,
        Double distanceKm) {

    public static UserView from(User user) {
        return from(user, null);
    }

    public static UserView from(User user, Double distanceKm) {
        return new UserView(
                user.getId(),
                user.getName(),
                user.getBio(),
                user.getMood(),
                user.getLatitude(),
                user.getLongitude(),
                user.getAvatarColor(),
                distanceKm
        );
    }
}
