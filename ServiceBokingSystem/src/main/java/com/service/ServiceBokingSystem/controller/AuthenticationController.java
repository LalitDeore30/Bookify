package com.service.ServiceBokingSystem.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.service.ServiceBokingSystem.dto.AuthenticationRequest;
import com.service.ServiceBokingSystem.dto.SignupRequestDTO;
import com.service.ServiceBokingSystem.dto.UserDto;
import com.service.ServiceBokingSystem.entity.User;
import com.service.ServiceBokingSystem.repository.UserRepository;
import com.service.ServiceBokingSystem.services.authentication.AuthService;
import com.service.ServiceBokingSystem.services.jwt.UserDetailsServiceImpl;
import com.service.ServiceBokingSystem.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AuthenticationController {
    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public static final String TOKEN_PREFIX = "Bearer";
    public static final String HEADER_STRING = "Authorization";

    @PostMapping({ "/client/sign-up", "/api/auth/client/sign-up" })
    public ResponseEntity<?> signupClient(@RequestBody SignupRequestDTO signupRequestDTO) {
        if (authService.presentByEmail(signupRequestDTO.getEmail())) {
            return new ResponseEntity<>("Client aleready exist with this email", HttpStatus.NOT_ACCEPTABLE);
        }
        UserDto createdUser = authService.signupClient(signupRequestDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.OK);
    }

    @PostMapping({ "/company/sign-up", "/api/auth/company/sign-up" })
    public ResponseEntity<?> signupCompany(@RequestBody SignupRequestDTO signupRequestDTO) {
        System.out.println("=== COMPANY SIGNUP START ===");
        System.out.println("Request data - Name: " + signupRequestDTO.getName() +
                ", Email: " + signupRequestDTO.getEmail());

        if (authService.presentByEmail(signupRequestDTO.getEmail())) {
            System.out.println("Company already exists with email: " + signupRequestDTO.getEmail());
            return new ResponseEntity<>("Company already exist with this email", HttpStatus.NOT_ACCEPTABLE);
        }

        try {
            UserDto createdUser = authService.signupCompany(signupRequestDTO);
            System.out.println("Service returned: " + (createdUser != null ? createdUser.getEmail() : "NULL"));

            if (createdUser == null) {
                System.out.println("ERROR: Service returned null user");
                return new ResponseEntity<>("Failed to create company", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            System.out.println("=== COMPANY SIGNUP SUCCESS ===");
            return new ResponseEntity<>(createdUser, HttpStatus.OK);

        } catch (Exception e) {
            System.out.println("ERROR during company signup: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error creating company: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping({ "/authenticate", "/api/auth/login" })
    public void createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest,
            HttpServletResponse response) throws Exception {
        System.out.println(
                "Authenticating: " + authenticationRequest.getUsername() + " / " + authenticationRequest.getPassword());
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(),
                    authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
        User user = userRepository.findFirstByEmail(authenticationRequest.getUsername());

        response.getWriter().write(new JSONObject()
                .put("userId", user.getId())
                .put("role", user.getRole())
                .toString());

        response.addHeader("Access-Control-Expose-Headers", "Authorization");
        response.addHeader("Access-Control-Allow-Headers", "Authorization, " +
                "X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, X-Custom-header");

        response.addHeader(HEADER_STRING, TOKEN_PREFIX + " " + jwt);

    }

    // Test endpoint to verify backend is working
    @PostMapping("/api/auth/test")
    public ResponseEntity<String> testEndpoint() {
        return new ResponseEntity<>("Backend is working!", HttpStatus.OK);
    }

    // Add refresh token endpoint
    @PostMapping("/api/auth/refresh-token")
    public ResponseEntity<String> refreshToken() {
        return new ResponseEntity<>("Refresh token endpoint - not implemented yet", HttpStatus.NOT_IMPLEMENTED);
    }

    // Add logout endpoint
    @PostMapping("/api/auth/logout")
    public ResponseEntity<String> logout() {
        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }

}
