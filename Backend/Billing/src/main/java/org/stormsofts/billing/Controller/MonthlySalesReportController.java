package org.stormsofts.billing.Controller;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.MonthlySalesReportService;
import org.stormsofts.billing.model.MonthlySalesReportDTO;
import org.stormsofts.billing.model.Shop;
import org.stormsofts.billing.Repository.ShopRepository;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class MonthlySalesReportController {

    @Autowired
    private  MonthlySalesReportService service;
    @Autowired
    private  ShopRepository shopRepo;

    @Autowired
    private HttpServletRequest request;   // ✅ inject request

    // ✅ REPLACED METHOD
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @GetMapping("/monthly-sales")
    public List<MonthlySalesReportDTO> getMonthlySales(
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {

        Shop shop = getCurrentShop(); // 🔥 shop filter

        System.out.println("SHOP ID = " + shop.getShopId());
        System.out.println("FROM = " + fromDate);
        System.out.println("TO = " + toDate);
        return service.getMonthlySales(shop, fromDate, toDate);
    }
}
