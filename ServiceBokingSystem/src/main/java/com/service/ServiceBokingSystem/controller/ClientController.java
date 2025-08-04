package com.service.ServiceBokingSystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service.ServiceBokingSystem.dto.ReservationDTO;
import com.service.ServiceBokingSystem.services.client.ClientService;
import com.service.ServiceBokingSystem.services.company.CompanyService;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @Autowired
    private CompanyService companyService;

    @GetMapping("/ads")
    public ResponseEntity<?> getAllAds() {
        return ResponseEntity.ok(clientService.getAllAds());
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<?> searchByService(@PathVariable String name) {
        return ResponseEntity.ok(clientService.searchAdByName(name));
    }

    @PostMapping("/book-service")
    public ResponseEntity<?> bookService(@RequestBody ReservationDTO reservationDTO) {
        boolean success = clientService.bookService(reservationDTO);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/ad/{adId}")
    public ResponseEntity<?> getAdDetailsById(@PathVariable Long adId) {
        return ResponseEntity.ok(clientService.getAdDetailsByAdId(adId));
    }

    @GetMapping("/booking/{bookingId}/{status}")
    public ResponseEntity<?> changeBookingStatus(@PathVariable Long bookingId, @PathVariable String status) {
        boolean success = companyService.changeBookingStatus(bookingId, status);
        if (success)
            return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/my-bookings/{userId}")
    public ResponseEntity<?> getAllBookingsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(clientService.getAllBookingsByUserId(userId));
    }

    @PostMapping("/review")
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest reviewRequest) {
        Boolean success = clientService.submitReview(
                reviewRequest.getBookingId(),
                reviewRequest.getUserId(),
                reviewRequest.getRating(),
                reviewRequest.getReview());

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // Simple DTO class for review request
    public static class ReviewRequest {
        private Long bookingId;
        private Long userId;
        private Integer rating;
        private String review;

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Integer getRating() {
            return rating;
        }

        public void setRating(Integer rating) {
            this.rating = rating;
        }

        public String getReview() {
            return review;
        }

        public void setReview(String review) {
            this.review = review;
        }
    }
}
