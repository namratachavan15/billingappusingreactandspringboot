package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.AuthService;

import org.stormsofts.billing.model.CreateShopRequest;
import org.stormsofts.billing.model.LoginRequest;
import org.stormsofts.billing.model.LoginResponse;
import org.stormsofts.billing.model.Shop;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)


public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ADMIN creates shop + owner
//    @PostMapping("/admin/create-shop")
//    public void createShop(@RequestBody Shop shop,
//                           @RequestParam String password) {
//        authService.adminCreateShop(shop, password);
//    }
    @PostMapping("/admin/create-shop")
    public void createShop(@RequestBody CreateShopRequest request) {

        Shop shop = new Shop();
        shop.setShopName(request.getShopName());
        shop.setOwnerName(request.getOwnerName());
        shop.setMobile(request.getMobile());
        shop.setEmail(request.getEmail());

        authService.adminCreateShop(shop, request.getPassword());
    }
    // OWNER completes shop registration
    @PutMapping("/owner/complete-shop/{shopId}")
    public void completeShop(@PathVariable Long shopId,
                             @RequestBody Shop shop) {
        authService.completeShop(shopId, shop);
    }
}
