package com.nearconnect.backend.service;

import com.nearconnect.backend.dto.AuthRequest;
import com.nearconnect.backend.dto.AuthResponse;
import com.nearconnect.backend.dto.RegisterRequest;
import com.nearconnect.backend.dto.UserView;
import com.nearconnect.backend.exception.ApiException;
import com.nearconnect.backend.model.User;
import com.nearconnect.backend.model.UserSession;
import com.nearconnect.backend.repository.UserRepository;
import com.nearconnect.backend.repository.UserSessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

@Service
public class AuthService {

    private static final List<String> AVATAR_COLORS = List.of(
            "#7c5cff", "#ff6b45", "#18a999", "#f59e0b", "#ec4899", "#2563eb");

    private final UserRepository userRepository;
    private final UserSessionRepository sessionRepository;
    private final PasswordHasher passwordHasher;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository, UserSessionRepository sessionRepository,
                       PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordHasher = passwordHasher;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String name = clean(request.name());
        String email = normalizeEmail(request.email());
        validatePassword(request.password());
        if (name.length() < 2 || name.length() > 80) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name must be between 2 and 80 characters.");
        }
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid email address.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordHasher.hash(request.password()));
        user.setBio(limit(clean(request.bio()), 500));
        user.setMood(limit(clean(request.mood()), 80));
        user.setAvatarColor(AVATAR_COLORS.get(secureRandom.nextInt(AVATAR_COLORS.size())));
        userRepository.save(user);
        return createSession(user);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect."));
        if (request.password() == null || !passwordHasher.verify(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect.");
        }
        return createSession(user);
    }

    public User requireUser(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        UserSession session = sessionRepository.findByTokenAndExpiresAtAfter(token, Instant.now())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Your session has expired. Please sign in again."));
        return userRepository.findById(session.getUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Account not found."));
    }

    @Transactional
    public void logout(String authorizationHeader) {
        sessionRepository.deleteByToken(extractToken(authorizationHeader));
    }

    private AuthResponse createSession(User user) {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);

        UserSession session = new UserSession();
        session.setToken(token);
        session.setUserId(user.getId());
        session.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        sessionRepository.save(session);
        return new AuthResponse(token, UserView.from(user));
    }

    private String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ") || header.length() <= 7) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Please sign in to continue.");
        }
        return header.substring(7).trim();
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 72) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be between 8 and 72 characters.");
        }
    }

    private String normalizeEmail(String email) {
        return clean(email).toLowerCase(Locale.ROOT);
    }

    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String limit(String value, int max) { return value.length() <= max ? value : value.substring(0, max); }
}
