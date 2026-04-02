package org.stormsofts.billing.Controller;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.Service.ReportService;

import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.model.DailySalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ReportController {

    @Autowired
    private  ReportService reportService;

    @Autowired
    private ShopRepository shopRepo;
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

    @GetMapping("/daily-sales")
    public List<DailySalesReportDTO> dailySalesReport(
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {
        System.out.println("inside controller");

        Shop shop = getCurrentShop(); // 🔥 get shop of logged-in user or default
        return reportService.getDailySales(shop, fromDate, toDate);
    }

}
