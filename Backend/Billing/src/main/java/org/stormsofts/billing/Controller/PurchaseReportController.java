package org.stormsofts.billing.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.Service.PurchaseReportService;
import org.stormsofts.billing.model.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/purchase-reports")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class PurchaseReportController {

    @Autowired
    private PurchaseReportService service;

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
    @GetMapping("/daily")
    public List<DailyPurchaseReportDTO> daily(

            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate
    ) {
        System.out.println("inside daily");


        Shop shop = getCurrentShop();
        return service.dailyReport(shop, fromDate, toDate);
    }

    @GetMapping("/monthly")
    public List<MonthlyPurchaseReportDTO> monthly(

            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate
    ) {
        Shop shop = getCurrentShop();
        return service.monthlyReport(shop, fromDate, toDate);
    }

    @GetMapping("/product-wise")
    public List<ProductWisePurchaseReportDTO> productWise(

            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate
    ) {
        Shop shop = getCurrentShop();
        return service.productWiseReport(shop, fromDate, toDate);
    }

    @GetMapping("/supplier-wise")
    public List<SupplierWisePurchaseReportDTO> supplierWise(

            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate
    ) {
        Shop shop = getCurrentShop();
        return service.supplierWiseReport(shop, fromDate, toDate);
    }
}

