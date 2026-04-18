package com.nearconnect.backend.controller;

import com.nearconnect.backend.model.Swipe;
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
    public String swipe(@RequestBody Swipe swipe) {
    return swipeService.swipe(
        swipe.getUserId(),
        swipe.getTargetUserId(),
        swipe.getAction()
    );
}
}