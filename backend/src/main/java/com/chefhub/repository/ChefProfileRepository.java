package com.chefhub.repository;

import com.chefhub.entity.ChefProfile;
import com.chefhub.entity.Tier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChefProfileRepository extends JpaRepository<ChefProfile, Long> {

    Optional<ChefProfile> findByUserEmail(String email);

    List<ChefProfile> findAllByOrderByIdDesc();

    @Query("""
            select c from ChefProfile c
            where c.approved = true
              and (:city is null or lower(c.city) = lower(:city))
              and (:cuisine is null or lower(c.cuisines) like lower(concat('%', :cuisine, '%')))
              and (:tier is null or c.tier = :tier)
            """)
    Page<ChefProfile> search(@Param("city") String city,
                             @Param("cuisine") String cuisine,
                             @Param("tier") Tier tier,
                             Pageable pageable);
}
