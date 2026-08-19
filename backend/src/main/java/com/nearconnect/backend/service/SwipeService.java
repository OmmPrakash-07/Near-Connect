package com.nearconnect.backend.service;

import com.nearconnect.backend.dto.SwipeRequest;
import com.nearconnect.backend.dto.SwipeResult;
import com.nearconnect.backend.dto.UserView;
import com.nearconnect.backend.exception.ApiException;
import com.nearconnect.backend.model.Match;
import com.nearconnect.backend.model.Swipe;
import com.nearconnect.backend.model.User;
import com.nearconnect.backend.repository.MatchRepository;
import com.nearconnect.backend.repository.SwipeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
public class SwipeService {

    private final SwipeRepository swipeRepository;
    private final MatchRepository matchRepository;
    private final UserService userService;

    public SwipeService(SwipeRepository swipeRepository, MatchRepository matchRepository, UserService userService) {
        this.swipeRepository = swipeRepository;
        this.matchRepository = matchRepository;
        this.userService = userService;
    }

    @Transactional
    public SwipeResult swipe(User currentUser, SwipeRequest request) {
        if (request.targetUserId() == null || request.targetUserId().equals(currentUser.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Choose another profile.");
        }
        User target = userService.findById(request.targetUserId());
        String action = request.action() == null ? "" : request.action().trim().toUpperCase(Locale.ROOT);
        if (!action.equals("LIKE") && !action.equals("PASS")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Swipe action must be LIKE or PASS.");
        }

        Swipe swipe = swipeRepository.findByUserIdAndTargetUserId(currentUser.getId(), target.getId())
                .orElseGet(Swipe::new);
        swipe.setUserId(currentUser.getId());
        swipe.setTargetUserId(target.getId());
        swipe.setAction(action);
        swipeRepository.save(swipe);

        if (!action.equals("LIKE")) {
            return new SwipeResult(false, null, null, "Profile passed.");
        }

        Optional<Swipe> reverse = swipeRepository.findByUserIdAndTargetUserId(target.getId(), currentUser.getId());
        if (reverse.isEmpty() || !"LIKE".equals(reverse.get().getAction())) {
            return new SwipeResult(false, null, null, "Connection request sent.");
        }

        long user1 = Math.min(currentUser.getId(), target.getId());
        long user2 = Math.max(currentUser.getId(), target.getId());
        Match match = matchRepository.findByUser1AndUser2(user1, user2).orElseGet(() -> {
            Match created = new Match();
            created.setUser1(user1);
            created.setUser2(user2);
            return matchRepository.save(created);
        });
        return new SwipeResult(true, match.getId(), UserView.from(target), "It is a mutual connection!");
    }
}
