package com.exchange.security;

import com.exchange.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom UserDetailsService implementation
 * Loads user details from database for Spring Security authentication.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // TODO: Implement load user by username or email
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * Load user by ID
     * @param id the user ID
     * @return UserDetails
     */
    public UserDetails loadUserById(Long id) {
        // TODO: Implement load user by ID
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
