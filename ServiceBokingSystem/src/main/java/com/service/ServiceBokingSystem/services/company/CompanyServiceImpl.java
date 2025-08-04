package com.service.ServiceBokingSystem.services.company;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.service.ServiceBokingSystem.dto.AdDTO;
import com.service.ServiceBokingSystem.dto.ReservationDTO;
import com.service.ServiceBokingSystem.entity.Ad;
import com.service.ServiceBokingSystem.entity.Reservation;
import com.service.ServiceBokingSystem.entity.Review;
import com.service.ServiceBokingSystem.entity.User;
import com.service.ServiceBokingSystem.enums.ReservationStatus;
import com.service.ServiceBokingSystem.repository.AdRepository;
import com.service.ServiceBokingSystem.repository.ReservationRepository;
import com.service.ServiceBokingSystem.repository.ReviewRepository;
import com.service.ServiceBokingSystem.repository.UserRepository;

@Service
public class CompanyServiceImpl implements CompanyService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AdRepository adRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    public boolean postAd(Long userId, AdDTO adDTO) throws IOException {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            Ad ad = new Ad();
            ad.setServiceName(adDTO.getServiceName());
            ad.setDescription(adDTO.getDescription());

            // Handle image safely - check if image is provided
            if (adDTO.getImg() != null && !adDTO.getImg().isEmpty()) {
                ad.setImg(adDTO.getImg().getBytes());
            } else {
                ad.setImg(null); // or set a default image
            }

            ad.setPrice(adDTO.getPrice());
            ad.setUser(optionalUser.get());

            adRepository.save(ad);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<AdDTO> getAllAds(Long userId) {
        return adRepository.findAllByUserId(userId).stream().map(this::createAdDTO).collect(Collectors.toList());
    }

    private AdDTO createAdDTO(Ad ad) {
        AdDTO adDTO = new AdDTO();
        adDTO.setId(ad.getId());
        adDTO.setServiceName(ad.getServiceName());
        adDTO.setDescription(ad.getDescription());
        adDTO.setPrice(ad.getPrice());
        adDTO.setReturnedImg(ad.getImg());

        // Safely access user name
        if (ad.getUser() != null) {
            adDTO.setCompanyName(ad.getUser().getName());
        }

        return adDTO;
    }

    @Transactional(readOnly = true)
    public AdDTO getAdById(Long adId) {
        System.out.println("Getting ad with ID: " + adId);
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if (optionalAd.isPresent()) {
            Ad ad = optionalAd.get();
            AdDTO adDTO = createAdDTO(ad);

            System.out.println("Found ad - ID: " + adDTO.getId() +
                    ", ServiceName: " + adDTO.getServiceName() +
                    ", Description: " + adDTO.getDescription() +
                    ", Price: " + adDTO.getPrice() +
                    ", CompanyName: " + adDTO.getCompanyName());
            return adDTO;
        } else {
            System.out.println("Ad not found with ID: " + adId);
            return null;
        }
    }

    public boolean updateAd(Long adId, AdDTO adDTO) throws IOException {
        System.out.println("Updating ad with ID: " + adId);
        System.out.println("Update data - ServiceName: " + adDTO.getServiceName() +
                ", Description: " + adDTO.getDescription() +
                ", Price: " + adDTO.getPrice() +
                ", Image: " + (adDTO.getImg() != null ? "provided" : "null"));

        Optional<Ad> optionalAd = adRepository.findById(adId);
        if (optionalAd.isPresent()) {
            Ad ad = optionalAd.get();
            System.out.println("Found existing ad - ServiceName: " + ad.getServiceName() +
                    ", Description: " + ad.getDescription() +
                    ", Price: " + ad.getPrice());

            // Only update fields that are not null or empty
            if (adDTO.getServiceName() != null && !adDTO.getServiceName().trim().isEmpty()) {
                ad.setServiceName(adDTO.getServiceName());
                System.out.println("Updated serviceName to: " + adDTO.getServiceName());
            }

            if (adDTO.getDescription() != null && !adDTO.getDescription().trim().isEmpty()) {
                ad.setDescription(adDTO.getDescription());
                System.out.println("Updated description to: " + adDTO.getDescription());
            }

            if (adDTO.getPrice() != null) {
                ad.setPrice(adDTO.getPrice());
                System.out.println("Updated price to: " + adDTO.getPrice());
            }

            // Only update image if a new one is provided
            if (adDTO.getImg() != null && adDTO.getImg().getSize() > 0) {
                ad.setImg(adDTO.getImg().getBytes());
                System.out.println("Updated image");
            }

            adRepository.save(ad);
            System.out.println("Ad updated successfully");
            return true;
        } else {
            System.out.println("Ad not found with ID: " + adId);
            return false;
        }
    }

    public boolean deleteAd(Long adId) {
        System.out.println("Deleting ad with ID: " + adId);
        Optional<Ad> optionalAd = adRepository.findById(adId);
        if (optionalAd.isPresent()) {
            adRepository.delete(optionalAd.get());
            System.out.println("Ad deleted successfully");
            return true;
        } else {
            System.out.println("Ad not found with ID: " + adId);
            return false;
        }
    }

    public List<ReservationDTO> getAllAdBookings(Long companyId) {
        return reservationRepository.findAllByCompanyId(companyId).stream().map(Reservation::getReservationDto)
                .collect(Collectors.toList());
    }

    public boolean changeBookingStatus(Long bookingId, String status) {
        Optional<Reservation> optionalReservation = reservationRepository.findById(bookingId);
        if (optionalReservation.isPresent()) {
            Reservation existingReservation = optionalReservation.get();
            if (Objects.equals(status, "Approve")) {
                existingReservation.setReservationStatus(ReservationStatus.APPROVED);
            } else {
                existingReservation.setReservationStatus(ReservationStatus.REJECTED);
            }
            reservationRepository.save(existingReservation);
            return true;
        }
        return false;
    }

    @Override
    public List<Object> getAdReviews(Long adId) {
        try {
            System.out.println("Fetching reviews for ad ID: " + adId);
            List<Review> reviews = reviewRepository.findAllByAdId(adId);
            System.out.println("Found " + reviews.size() + " reviews for ad ID: " + adId);
            return reviews.stream().map(review -> {
                Map<String, Object> reviewData = new HashMap<>();
                reviewData.put("id", review.getId());
                reviewData.put("rating", review.getRating());
                reviewData.put("review", review.getReview());
                reviewData.put("reviewDate", review.getReviewDate());
                reviewData.put("userName", review.getUser().getName());
                reviewData.put("userEmail", review.getUser().getEmail());
                return reviewData;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error fetching reviews for ad " + adId + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
