package org.stormsofts.billing.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Config.JwtUtil;
import org.stormsofts.billing.Repository.*;
import org.stormsofts.billing.model.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private  UserRepository userRepo;
    @Autowired
    private  ShopRepository shopRepo;
    @Autowired
    private  EmployeeRepository empRepo;
    @Autowired
    private  PasswordEncoder encoder;
    @Autowired
    private  JwtUtil jwtUtil;

    // LOGIN
    public LoginResponse login(LoginRequest request) {
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        Long shopId = null;
        String shopName = null;
        Long employeeId = null;
        Boolean profileCompleted = null;

        if (user.getRole() != Role.ADMIN && user.getShop() != null) {
            shopId = user.getShop().getShopId();
            shopName = user.getShop().getShopName();
            profileCompleted = user.getShop().getProfileCompleted();

            if (user.getEmployee() != null) employeeId = user.getEmployee().getEmpId();
        }

        String token = jwtUtil.generateToken(user.getUserId(), user.getRole().name(), shopId);

        return new LoginResponse(
                token,
                user.getUserId(),
                user.getRole().name(),
                shopId,
                employeeId,
                shopName,
                profileCompleted
        );
    }

    // ADMIN CREATE SHOP + OWNER
    @Transactional
    public void adminCreateShop(Shop shop, String password) {
        shop.setProfileCompleted(false);
        shop.setCreatedAt(LocalDateTime.now());
        Shop savedShop = shopRepo.save(shop);

        Employee owner = new Employee();
        owner.setName(shop.getOwnerName());
        owner.setRole("OWNER");
        owner.setMob(shop.getMobile());
        owner.setEmail(shop.getEmail());
        owner.setJoinDate(LocalDate.now());
        owner.setStatus(true);
        owner.setShop(savedShop);
        Employee savedEmp = empRepo.save(owner);

        User user = new User();
        user.setUsername(shop.getEmail());
        user.setPassword(encoder.encode(password));
        user.setRole(Role.OWNER);
        user.setShop(savedShop);
        user.setEmployee(savedEmp);
        user.setCreatedAt(LocalDate.now());
        userRepo.save(user);
    }

    // OWNER COMPLETE SHOP
    @Transactional
    public void completeShop(Long shopId, Shop data) {
        Shop shop = shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        shop.setGstNo(data.getGstNo());
        shop.setAddress(data.getAddress());
        shop.setBankName(data.getBankName());
        shop.setBankAc(data.getBankAc());
        shop.setIfsc(data.getIfsc());
        shop.setBranch(data.getBranch());
        shop.setBranchName(data.getBranchName());

        shop.setProfileCompleted(true);
        shopRepo.save(shop);
    }
}
