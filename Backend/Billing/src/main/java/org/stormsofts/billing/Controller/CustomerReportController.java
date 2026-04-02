package org.stormsofts.billing.Controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.Service.CustomerReportService;
import org.stormsofts.billing.model.CustomerWiseSalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
@RequiredArgsConstructor
public class CustomerReportController {
    @Autowired
    private  CustomerReportService service;
    @Autowired
    private  ShopRepository shopRepo;
    @Autowired
    private  HttpServletRequest request;   // ✅ inject request

    // ✅ REPLACED METHOD
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @GetMapping("/customer-wise-sales")
    public List<CustomerWiseSalesReportDTO> getCustomerWiseSales(
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {

        Shop shop = getCurrentShop(); // 🔥 filter by shop
        return service.getCustomerWiseSales(shop, fromDate, toDate);
    }
}
