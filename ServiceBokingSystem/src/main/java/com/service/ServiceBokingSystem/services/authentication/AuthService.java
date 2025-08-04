package com.service.ServiceBokingSystem.services.authentication;

import com.service.ServiceBokingSystem.dto.SignupRequestDTO;
import com.service.ServiceBokingSystem.dto.UserDto;

public interface AuthService {
    UserDto signupClient(SignupRequestDTO signupRequestDTO);

    Boolean presentByEmail(String email);

    UserDto signupCompany(SignupRequestDTO signupRequestDTO);
}
