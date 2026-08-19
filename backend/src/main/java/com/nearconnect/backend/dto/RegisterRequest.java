package com.nearconnect.backend.dto;

public record RegisterRequest(String name, String email, String password, String bio, String mood) {}
