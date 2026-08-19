package com.nearconnect.backend.controller;

import com.nearconnect.backend.dto.SwipeRequest;
import com.nearconnect.backend.dto.SwipeResult;
import com.nearconnect.backend.service.AuthService;
import com.nearconnect.backend.service.SwipeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/swipes")
public class SwipeController {

    private final SwipeService swipeService;
    private final AuthService authService;

    public SwipeController(SwipeService swipeService, AuthService authService) {
        this.swipeService = swipeService;
        this.authService = authService;
    }

    @PostMapping
    public SwipeResult swipe(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody SwipeRequest request) {
        return swipeService.swipe(authService.requireUser(authorization), request);
    }
}
