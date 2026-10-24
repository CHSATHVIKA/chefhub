package com.chefhub.repository;

import com.chefhub.entity.AvailabilitySlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByChefIdOrderByDateAscStartTimeAsc(Long chefId);

    List<AvailabilitySlot> findByChefIdAndBookedFalseAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(Long chefId, LocalDate from);

    boolean existsByChefIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(Long chefId, LocalDate date,
                                                                           LocalTime end, LocalTime start);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AvailabilitySlot s where s.id = :id")
    Optional<AvailabilitySlot> findByIdForUpdate(@Param("id") Long id);
}
