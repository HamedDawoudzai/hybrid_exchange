package com.exchange.repository;

import com.exchange.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link User}.
 * Handles user lookup by email, username, and authentication.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Finds a user by email address. */
    Optional<User> findByEmail(String email);

    /** Finds a user by username. */
    Optional<User> findByUsername(String username);

    /** Returns true if a user exists with the given email. */
    Boolean existsByEmail(String email);

    /** Returns true if a user exists with the given username. */
    Boolean existsByUsername(String username);

    /** Finds a user by username or email (for login by either identifier). */
    Optional<User> findByUsernameOrEmail(String username, String email);
}