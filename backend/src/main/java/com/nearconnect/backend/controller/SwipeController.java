package com.nearconnect.backend.controller;

import com.nearconnect.backend.service.SwipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/swipe")
@CrossOrigin
public class SwipeController {

    @Autowired
    private SwipeService swipeService;

    @PostMapping
    public String swipe(
            @RequestParam Long userId,
            @RequestParam Long targetUserId,
            @RequestParam String action
    ) {
        return swipeService.swipe(userId, targetUserId, action);
    }
}