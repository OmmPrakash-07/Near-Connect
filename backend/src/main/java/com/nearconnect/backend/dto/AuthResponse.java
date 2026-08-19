package com.nearconnect.backend.dto;

public record AuthResponse(String token, UserView user) {}
