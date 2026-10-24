package com.chefhub.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "chef_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChefProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(length = 1000)
    private String bio;

    // comma separated, e.g. "North Indian,Mughlai"
    private String cuisines;

    @Column(precision = 10, scale = 2)
    private BigDecimal pricePerVisit;

    private String city;

    @Column(length = 500)
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Tier tier = Tier.STANDARD;

    private boolean approved;
}
