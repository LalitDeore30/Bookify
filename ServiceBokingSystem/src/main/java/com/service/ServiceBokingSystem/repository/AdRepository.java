package com.service.ServiceBokingSystem.repository;

import com.service.ServiceBokingSystem.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findAllByUserId(Long userId);

    List<Ad> findAllByServiceNameContaining(String name);
}
