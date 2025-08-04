package com.service.ServiceBokingSystem.repository;

import com.service.ServiceBokingSystem.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  List<Reservation> findAllByCompanyId(Long companyId);

  List<Reservation> findAllByUserId(Long userId);
}
