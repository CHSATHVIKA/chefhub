package com.chefhub.repository;

import com.chefhub.entity.Booking;
import com.chefhub.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerEmailOrderByCreatedAtDesc(String email);

    List<Booking> findByChefIdOrderByCreatedAtDesc(Long chefId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    boolean existsBySlotIdAndStatusIn(Long slotId, Collection<BookingStatus> statuses);
}
