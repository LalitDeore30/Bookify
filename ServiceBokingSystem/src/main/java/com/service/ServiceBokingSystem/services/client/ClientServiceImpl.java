package com.service.ServiceBokingSystem.services.client;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.service.ServiceBokingSystem.dto.AdDTO;
import com.service.ServiceBokingSystem.dto.AdDetailsForClientDTO;
import com.service.ServiceBokingSystem.dto.ReservationDTO;
import com.service.ServiceBokingSystem.entity.Ad;
import com.service.ServiceBokingSystem.entity.Reservation;
import com.service.ServiceBokingSystem.entity.Review;
import com.service.ServiceBokingSystem.entity.User;
import com.service.ServiceBokingSystem.enums.ReservationStatus;
import com.service.ServiceBokingSystem.enums.ReviewStatus;
import com.service.ServiceBokingSystem.repository.AdRepository;
import com.service.ServiceBokingSystem.repository.ReservationRepository;
import com.service.ServiceBokingSystem.repository.ReviewRepository;
import com.service.ServiceBokingSystem.repository.UserRepository;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdDTO> getAllAds() {
        return adRepository.findAll().stream().map(this::createAdDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdDTO> searchAdByName(String name) {
        return adRepository.findAllByServiceNameContaining(name).stream().map(this::createAdDTO)
                .collect(Collectors.toList());
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

    @Override
    public boolean bookService(ReservationDTO reservationDTO) {
        Optional<Ad> optionalAd = adRepository.findById(reservationDTO.getAdId());
        Optional<User> optionalUser = userRepository.findById(reservationDTO.getUserId());

        if (optionalAd.isPresent() && optionalUser.isPresent()) {
            Reservation reservation = new Reservation();
            reservation.setBookDate(reservationDTO.getBookDate());
            reservation.setReservationStatus(ReservationStatus.PENDING);
            reservation.setUser(optionalUser.get());
            reservation.setAd(optionalAd.get());
            reservation.setCompany(optionalAd.get().getUser());
            reservation.setReviewStatus(ReviewStatus.FALSE);
            reservationRepository.save(reservation);
            return true;
        }
        return false;
    }

    @Override
    public AdDetailsForClientDTO getAdDetailsByAdId(Long adId) {
        Optional<Ad> optionalAd = adRepository.findById(adId);
        AdDetailsForClientDTO adDetailsForClientDTO = new AdDetailsForClientDTO();

        if (optionalAd.isPresent()) {
            adDetailsForClientDTO.setAdDTO(optionalAd.get().getAdDto());

            List<Review> reviewList = reviewRepository.findAllByAdId(adId);
            adDetailsForClientDTO
                    .setReviewDTOList(reviewList.stream().map(Review::getDto).collect(Collectors.toList()));
        }
        return adDetailsForClientDTO;
    }

    @Override
    public List<ReservationDTO> getAllBookingsByUserId(Long userId) {
        return reservationRepository.findAllByUserId(userId).stream().map(Reservation::getReservationDto)
                .collect(Collectors.toList());
    }

    @Override
    public Boolean submitReview(Long bookingId, Long userId, Integer rating, String reviewText) {
        try {
            // Find the reservation/booking
            Optional<Reservation> reservationOpt = reservationRepository.findById(bookingId);
            if (!reservationOpt.isPresent()) {
                System.out.println("Booking not found with ID: " + bookingId);
                return false;
            }

            Reservation reservation = reservationOpt.get();

            // Verify the booking belongs to the user
            if (!reservation.getUser().getId().equals(userId)) {
                System.out.println("Booking does not belong to user. Booking user ID: " +
                        reservation.getUser().getId() + ", Request user ID: " + userId);
                return false;
            }

            // Check if review already exists
            if (reservation.getReviewStatus() == ReviewStatus.TRUE) {
                System.out.println("Review already exists for booking ID: " + bookingId);
                return false;
            }

            // Create and save the review
            Review review = new Review();
            review.setReviewDate(new Date());
            review.setReview(reviewText);
            review.setRating(Long.valueOf(rating));
            review.setUser(reservation.getUser());
            review.setAd(reservation.getAd());

            reviewRepository.save(review);

            // Update reservation review status
            reservation.setReviewStatus(ReviewStatus.TRUE);
            reservationRepository.save(reservation);

            System.out.println("Review submitted successfully for booking ID: " + bookingId);
            return true;

        } catch (Exception e) {
            System.out.println("Error submitting review: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
