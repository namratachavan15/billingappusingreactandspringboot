package org.stormsofts.billing.Controller;

import org.stormsofts.billing.Service.ShopService;
import org.stormsofts.billing.model.Shop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ShopController {

    @Autowired
    private ShopService shopService;

    // Get all shops or search by name
    @GetMapping
    public List<Shop> getAllShops(@RequestParam(value = "search", required = false) String search) {
        return shopService.getAllShops(search);
    }

    // Get shop by ID
    @GetMapping("/{id}")
    public Optional<Shop> getShop(@PathVariable Long id) {
        return shopService.getShopById(id);
    }

    // Add shop
    @PostMapping
    public Shop addShop(@RequestBody Shop shop) {
        return shopService.addShop(shop);
    }

    // Update shop
    @PutMapping("/{id}")
    public Shop updateShop(@PathVariable Long id, @RequestBody Shop shopDetails) {
        return shopService.updateShop(id, shopDetails);
    }

    // Delete shop
    @DeleteMapping("/{id}")
    public void deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
    }
}
