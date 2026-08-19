package com.nearconnect.backend;

import com.nearconnect.backend.service.PasswordHasher;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordHasherTests {

    private final PasswordHasher passwordHasher = new PasswordHasher();

    @Test
    void hashesAndVerifiesWithoutStoringPlainText() {
        String hash = passwordHasher.hash("strong-password");

        assertNotEquals("strong-password", hash);
        assertTrue(passwordHasher.verify("strong-password", hash));
        assertFalse(passwordHasher.verify("wrong-password", hash));
    }
}
