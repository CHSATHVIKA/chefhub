package com.chefhub.config;

import com.chefhub.entity.*;
import com.chefhub.repository.AvailabilitySlotRepository;
import com.chefhub.repository.ChefProfileRepository;
import com.chefhub.repository.MenuItemRepository;
import com.chefhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final String DEMO_PASSWORD = "password123";

    private final UserRepository userRepository;
    private final ChefProfileRepository chefRepository;
    private final MenuItemRepository menuRepository;
    private final AvailabilitySlotRepository slotRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        createUser("ChefHub Admin", "admin@chefhub.in", "9000000001", Role.ADMIN);
        createUser("Priya Sharma", "priya@example.com", "9820012345", Role.CUSTOMER);
        createUser("Rahul Verma", "rahul@example.com", "9811054321", Role.CUSTOMER);

        ChefProfile arjun = createChef("Arjun Mehta", "arjun@chefhub.in", "Mumbai", "North Indian,Mughlai",
                3500, Tier.PREMIUM,
                "Fifteen years in Delhi and Mumbai hotel kitchens. I cook slow-cooked dals, tandoor-style kebabs and rich Mughlai gravies for family dinners and small parties.",
                "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80");
        addMenu(arjun, "Dal Makhani", "Black lentils simmered overnight with butter and cream", 450, true);
        addMenu(arjun, "Murgh Malai Tikka", "Chicken marinated in cream, cheese and cardamom", 650, false);
        addMenu(arjun, "Mutton Rogan Josh", "Kashmiri-style lamb curry with whole spices", 850, false);
        addMenu(arjun, "Paneer Lababdar", "Cottage cheese in a tomato and cashew gravy", 520, true);

        ChefProfile meera = createChef("Meera Iyer", "meera@chefhub.in", "Bengaluru", "South Indian,Chettinad",
                2200, Tier.STANDARD,
                "I grew up in my grandmother's kitchen in Madurai. Expect crisp dosas, Chettinad pepper chicken and a proper banana-leaf meal at your home.",
                "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800&q=80");
        addMenu(meera, "Ghee Roast Dosa", "Paper-thin dosa with coconut chutney and sambar", 220, true);
        addMenu(meera, "Chettinad Pepper Chicken", "Dry chicken roast with black pepper and curry leaves", 480, false);
        addMenu(meera, "Bisi Bele Bath", "Spiced rice and lentils with vegetables and ghee", 260, true);

        ChefProfile kabir = createChef("Kabir Singh", "kabir@chefhub.in", "Delhi", "Punjabi,Tandoor",
                2800, Tier.STANDARD,
                "Amritsari dhaba flavours made at home. I bring my own spice blends and can set up a small charcoal grill on your terrace.",
                "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=80");
        addMenu(kabir, "Amritsari Kulcha with Chole", "Stuffed kulcha baked crisp, served with chole", 300, true);
        addMenu(kabir, "Butter Chicken", "Tandoori chicken in a smoky tomato butter gravy", 550, false);
        addMenu(kabir, "Sarson da Saag with Makki Roti", "Mustard greens with maize flatbread and white butter", 380, true);

        ChefProfile ananya = createChef("Ananya Rao", "ananya@chefhub.in", "Hyderabad", "Hyderabadi,Biryani",
                4000, Tier.PREMIUM,
                "Dum biryani is my speciality. I cook in handi pots sealed with dough, the way it was done in old Hyderabad kitchens.",
                "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80");
        addMenu(ananya, "Kacchi Gosht Biryani", "Raw marinated mutton and rice slow-cooked on dum", 950, false);
        addMenu(ananya, "Mirchi ka Salan", "Green chillies in a peanut and sesame gravy", 280, true);
        addMenu(ananya, "Double ka Meetha", "Bread pudding with saffron milk and dry fruits", 260, true);

        ChefProfile rohan = createChef("Rohan D'Souza", "rohan@chefhub.in", "Mumbai", "Continental,Italian",
                3000, Tier.STANDARD,
                "Trained in Goa and Florence. I cook fresh pasta, wood-fired style pizzas and simple European dishes for dinner parties.",
                "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=80");
        addMenu(rohan, "Handmade Fettuccine Alfredo", "Fresh egg pasta in a parmesan cream sauce", 520, true);
        addMenu(rohan, "Grilled Fish with Lemon Butter", "Catch of the day with herbed potatoes", 780, false);
        addMenu(rohan, "Tiramisu", "Coffee-soaked sponge with mascarpone cream", 350, true);

        ChefProfile sneha = createChef("Sneha Banerjee", "sneha@chefhub.in", "Kolkata", "Bengali,Seafood",
                2500, Tier.STANDARD,
                "Bengali home food the way my mother makes it. Mustard fish, slow-cooked mangsho and mishti to finish.",
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80");
        addMenu(sneha, "Shorshe Ilish", "Hilsa in a sharp mustard sauce", 900, false);
        addMenu(sneha, "Kosha Mangsho", "Slow-cooked spicy mutton curry", 750, false);
        addMenu(sneha, "Shukto", "Mixed vegetables in a light, bitter-sweet gravy", 300, true);

        for (ChefProfile chef : new ChefProfile[]{arjun, meera, kabir, ananya, rohan, sneha}) {
            addSlots(chef);
        }

        log.info("Seeded demo data: 1 admin, 2 customers, 6 chefs");
    }

    private User createUser(String name, String email, String phone, Role role) {
        return userRepository.save(User.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .password(passwordEncoder.encode(role == Role.ADMIN ? "admin123" : DEMO_PASSWORD))
                .role(role)
                .build());
    }

    private ChefProfile createChef(String name, String email, String city, String cuisines, int price,
                                   Tier tier, String bio, String photoUrl) {
        User user = createUser(name, email, "9876543210", Role.CHEF);
        return chefRepository.save(ChefProfile.builder()
                .user(user)
                .city(city)
                .cuisines(cuisines)
                .pricePerVisit(BigDecimal.valueOf(price))
                .tier(tier)
                .bio(bio)
                .photoUrl(photoUrl)
                .approved(true)
                .build());
    }

    private void addMenu(ChefProfile chef, String name, String description, int price, boolean veg) {
        menuRepository.save(MenuItem.builder()
                .chef(chef)
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .veg(veg)
                .build());
    }

    private void addSlots(ChefProfile chef) {
        LocalDate today = LocalDate.now();
        for (int day = 2; day <= 12; day += 2) {
            slotRepository.save(slot(chef, today.plusDays(day), LocalTime.of(12, 0), LocalTime.of(15, 0)));
            slotRepository.save(slot(chef, today.plusDays(day), LocalTime.of(19, 0), LocalTime.of(22, 0)));
        }
    }

    private AvailabilitySlot slot(ChefProfile chef, LocalDate date, LocalTime start, LocalTime end) {
        return AvailabilitySlot.builder().chef(chef).date(date).startTime(start).endTime(end).build();
    }
}
