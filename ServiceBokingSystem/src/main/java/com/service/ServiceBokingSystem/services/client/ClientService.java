package com.service.ServiceBokingSystem.services.client;

import java.util.List;

import com.service.ServiceBokingSystem.dto.AdDTO;
import com.service.ServiceBokingSystem.dto.AdDetailsForClientDTO;
import com.service.ServiceBokingSystem.dto.ReservationDTO;

public interface ClientService {
    List<AdDTO> getAllAds();

    List<AdDTO> searchAdByName(String name);

    boolean bookService(ReservationDTO reservationDTO);

    AdDetailsForClientDTO getAdDetailsByAdId(Long adId);

    List<ReservationDTO> getAllBookingsByUserId(Long userId);

    Boolean submitReview(Long bookingId, Long userId, Integer rating, String reviewText);
}
