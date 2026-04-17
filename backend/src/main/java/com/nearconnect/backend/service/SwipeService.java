package com.nearconnect.backend.service;

import com.nearconnect.backend.model.Match;
import com.nearconnect.backend.model.Swipe;
import com.nearconnect.backend.repository.MatchRepository;
import com.nearconnect.backend.repository.SwipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SwipeService {

    @Autowired
    private SwipeRepository swipeRepository;

    @Autowired
    private MatchRepository matchRepository;

    public String swipe(Long userId, Long targetUserId, String action) {

        Swipe swipe = new Swipe();
        swipe.setUserId(userId);
        swipe.setTargetUserId(targetUserId);
        swipe.setAction(action);

        swipeRepository.save(swipe);

        // 🔥 Check reverse like
        Optional<Swipe> reverseSwipe =
                swipeRepository.findByUserIdAndTargetUserId(targetUserId, userId);

        if (reverseSwipe.isPresent()
                && reverseSwipe.get().getAction().equals("LIKE")
                && action.equals("LIKE")) {

            Match match = new Match();
            match.setUser1(userId);
            match.setUser2(targetUserId);

            matchRepository.save(match);

            return "MATCH FOUND ❤️";
        }

        return "Swipe recorded";
    }
}