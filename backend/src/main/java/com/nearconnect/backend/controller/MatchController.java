package com.nearconnect.backend.controller;

import com.nearconnect.backend.dto.MatchView;
import com.nearconnect.backend.service.AuthService;
import com.nearconnect.backend.service.MatchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;
    private final AuthService authService;

    public MatchController(MatchService matchService, AuthService authService) {
        this.matchService = matchService;
        this.authService = authService;
    }

    @GetMapping
    public List<MatchView> getMatches(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        return matchService.getMatches(authService.requireUser(authorization));
    }
}
