package com.service.ServiceBokingSystem.entity;

import com.service.ServiceBokingSystem.dto.UserDto;
import com.service.ServiceBokingSystem.enums.UserRole;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lastname;
    private String email;
    private String password;
    private String phone;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public UserDto getDto() {
        UserDto userDto = new UserDto();
        userDto.setId(this.id);
        userDto.setName(this.name);
        userDto.setLastname(this.lastname);
        userDto.setEmail(this.email);
        userDto.setPhone(this.phone);
        userDto.setRole(this.role);
        return userDto;
    }
}
