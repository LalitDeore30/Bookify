package com.service.ServiceBokingSystem.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service.ServiceBokingSystem.dto.AdDTO;
import com.service.ServiceBokingSystem.dto.ReservationDTO;
import com.service.ServiceBokingSystem.services.company.CompanyService;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping("/ad/{userId}")
    public ResponseEntity<?> postAd(@PathVariable Long userId, @ModelAttribute AdDTO adDTO) throws IOException {
        boolean success = companyService.postAd(userId, adDTO);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ad posted successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found or failed to post ad");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/ads/{userId}")
    public ResponseEntity<?> getAllAdsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(companyService.getAllAds(userId));
    }

    @GetMapping("/ad/{adId}")
    public ResponseEntity<?> getAdById(@PathVariable Long adId) {
        AdDTO adDTO = companyService.getAdById(adId);
        if (adDTO != null) {
            return ResponseEntity.ok(adDTO);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Ad not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/ad/{adId}")
    public ResponseEntity<?> updateAd(@PathVariable Long adId, @ModelAttribute AdDTO adDTO) throws IOException {
        boolean success = companyService.updateAd(adId, adDTO);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ad updated successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Ad not found or failed to update");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/ad/{adId}")
    public ResponseEntity<?> deleteAd(@PathVariable Long adId) {
        boolean success = companyService.deleteAd(adId);
        if (success) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Ad deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Ad not found or failed to delete");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/booking/{companyId}")
    public ResponseEntity<List<ReservationDTO>> getAllAdBooking(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyService.getAllAdBookings(companyId));
    }

    @GetMapping("/booking/{bookingId}/{status}")
    public ResponseEntity<?> changeBookingStatus(@PathVariable Long bookingId, @PathVariable String status) {
        boolean success = companyService.changeBookingStatus(bookingId, status);
        if (success)
            return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/ad/{adId}/reviews")
    public ResponseEntity<List<Object>> getAdReviews(@PathVariable Long adId) {
        List<Object> reviews = companyService.getAdReviews(adId);
        return ResponseEntity.ok(reviews);
    }

}
