package com.service.ServiceBokingSystem.services.authentication;

import com.service.ServiceBokingSystem.dto.SignupRequestDTO;
import com.service.ServiceBokingSystem.dto.UserDto;
import com.service.ServiceBokingSystem.entity.User;
import com.service.ServiceBokingSystem.enums.UserRole;
import com.service.ServiceBokingSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    public UserDto signupClient(SignupRequestDTO signupRequestDTO) {
        User user = new User();
        user.setName(signupRequestDTO.getName());
        user.setLastname(signupRequestDTO.getLastname());
        user.setEmail(signupRequestDTO.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequestDTO.getPassword()));
        user.setPhone(signupRequestDTO.getPhone());
        user.setRole(UserRole.CLIENT);
        User saved = userRepository.save(user);
        System.out.println("Saved user: " + saved.getEmail() + ", password: " + saved.getPassword());
        return saved.getDto();
    }

    public UserDto signupCompany(SignupRequestDTO signupRequestDTO) {
        System.out.println("=== COMPANY SIGNUP DEBUG ===");
        System.out.println("Email: " + signupRequestDTO.getEmail());
        System.out.println("Name: " + signupRequestDTO.getName());
        System.out.println("UserRole.COMPANY value: " + UserRole.COMPANY);
        System.out.println("UserRole.COMPANY.name(): " + UserRole.COMPANY.name());

        User user = new User();
        user.setName(signupRequestDTO.getName());
        user.setLastname(signupRequestDTO.getLastname());
        user.setEmail(signupRequestDTO.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequestDTO.getPassword()));
        user.setPhone(signupRequestDTO.getPhone());
        user.setRole(UserRole.COMPANY);

        System.out.println("User role set to: " + user.getRole());
        System.out.println("About to save user...");

        try {
            User saved = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + saved.getId());
            System.out.println("Saved user role: " + saved.getRole());

            UserDto dto = saved.getDto();
            System.out.println("DTO created successfully");
            return dto;
        } catch (Exception e) {
            System.out.println("ERROR saving user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Boolean presentByEmail(String email) {
        return userRepository.findFirstByEmail(email) != null;
    }
}
