package com.chefhub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "chef_id")
    private ChefProfile chef;

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_id")
    private AvailabilitySlot slot;

    @Column(nullable = false, length = 500)
    private String address;

    private int guestCount;

    @Column(length = 500)
    private String notes;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
