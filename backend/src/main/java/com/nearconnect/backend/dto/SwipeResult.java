package com.nearconnect.backend.dto;

public record SwipeResult(boolean matched, Long matchId, UserView matchedUser, String message) {}
