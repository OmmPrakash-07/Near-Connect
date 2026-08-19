package com.nearconnect.backend.config;

import com.nearconnect.backend.model.User;
import com.nearconnect.backend.repository.UserRepository;
import com.nearconnect.backend.service.PasswordHasher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DemoDataConfig {

    @Bean
    CommandLineRunner seedDemoProfiles(
            UserRepository userRepository,
            PasswordHasher passwordHasher,
            @Value("${app.demo.seed:true}") boolean seedEnabled) {
        return args -> {
            if (!seedEnabled || userRepository.count() > 0) {
                return;
            }

            List<User> profiles = List.of(
                    profile("Aditi Sharma", "aditi@nearconnect.app", passwordHasher.hash("demo1234"),
                            "UX designer, slow-travel fan and always looking for a good filter coffee.",
                            "Coffee & conversations", 20.2961, 85.8245, "#7c5cff"),
                    profile("Rohan Das", "rohan@nearconnect.app", passwordHasher.hash("demo1234"),
                            "Indie developer building small products. Badminton after work, biryani on Sundays.",
                            "Build something together", 20.3012, 85.8197, "#ff6b45"),
                    profile("Meera Nair", "meera@nearconnect.app", passwordHasher.hash("demo1234"),
                            "New in the city. I photograph ordinary streets and collect uncommon playlists.",
                            "Photo walk", 20.2878, 85.8314, "#18a999"),
                    profile("Kabir Singh", "kabir@nearconnect.app", passwordHasher.hash("demo1234"),
                            "Product manager by day, amateur guitarist by night. Here for genuine local circles.",
                            "Live music", 20.3120, 85.8350, "#f59e0b"),
                    profile("Nisha Patel", "nisha@nearconnect.app", passwordHasher.hash("demo1234"),
                            "Founder, runner and book-club regular. Happy to swap startup stories over chai.",
                            "Founder meetup", 20.2798, 85.8179, "#ec4899"),
                    profile("Arjun Rao", "arjun@nearconnect.app", passwordHasher.hash("demo1234"),
                            "Learning motion design and exploring Bhubaneswar one neighbourhood at a time.",
                            "Explore nearby", 20.3059, 85.8421, "#2563eb")
            );
            userRepository.saveAll(profiles);
        };
    }

    private User profile(String name, String email, String password, String bio,
                         String mood, double latitude, double longitude, String avatarColor) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setBio(bio);
        user.setMood(mood);
        user.setLatitude(latitude);
        user.setLongitude(longitude);
        user.setAvatarColor(avatarColor);
        return user;
    }
}
