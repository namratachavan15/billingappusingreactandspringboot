package org.stormsofts.billing.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.Repository.UserRepository;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShopServiceImpl implements ShopService {
    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Get all shops or search by name
    public List<Shop> getAllShops(String search) {
        if (search != null && !search.isEmpty()) {
            return shopRepository.findByShopNameContainingIgnoreCase(search);
        }
        return shopRepository.findAll();
    }

    // Get shop by ID
    public Optional<Shop> getShopById(Long id) {
        return shopRepository.findById(id);
    }

    // Add shop
    public Shop addShop(Shop shop) {
        shop.setCreatedAt(LocalDateTime.now());
        return shopRepository.save(shop);
    }

    // Update shop
    public Shop updateShop(Long id, Shop shopDetails) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));

        shop.setShopName(shopDetails.getShopName());
        shop.setOwnerName(shopDetails.getOwnerName());
        shop.setMobile(shopDetails.getMobile());
        shop.setEmail(shopDetails.getEmail());
        shop.setGstNo(shopDetails.getGstNo());
        shop.setAddress(shopDetails.getAddress());
        shop.setBankName(shopDetails.getBankName());
        shop.setBankAc(shopDetails.getBankAc());
        shop.setIfsc(shopDetails.getIfsc());
        shop.setBranch(shopDetails.getBranch());
        shop.setBranchName(shopDetails.getBranchName());

        return shopRepository.save(shop);
    }

    // Delete shop
    public void deleteShop(Long id) {
        shopRepository.deleteById(id);
    }
}


