package org.stormsofts.billing.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.*;

import org.stormsofts.billing.model.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class OwnerDashboardService {

    @Autowired
    private  SaleRepository saleRepo;
    @Autowired
    private  PurchaseRepository purchaseRepo;
    @Autowired
    private  ProductRepository productRepo;
    @Autowired
    private  CustomerRepository customerRepo;
    @Autowired
    private  SupplierRepository supplierRepo;
    @Autowired
    private  StockRepository stockRepo;
    @Autowired
    private  ShopRepository shopRepo;
    @Autowired
    private  HttpServletRequest request;

    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");
        if (shopId == null) throw new RuntimeException("Shop not found");
        return shopRepo.findById(shopId).orElseThrow();
    }

    public OwnerDashboardResponse getDashboard() {

        Shop shop = getCurrentShop();
        LocalDate today = LocalDate.now();

        double todaySales = saleRepo.todaySales(shop, today);
        double todayPurchase = purchaseRepo.todayPurchase(shop, today);

        double monthlySales = saleRepo.monthlySales(
                shop, today.getMonthValue(), today.getYear()
        );
        double monthlyPurchase = purchaseRepo.monthlyPurchase(
                shop, today.getMonthValue(), today.getYear()
        );

        double todayProfit = todaySales - todayPurchase;
        double monthlyProfit = monthlySales - monthlyPurchase;

        return new OwnerDashboardResponse(

                // 1️⃣ SALES / PURCHASE
                todaySales,
                todayPurchase,
                monthlySales,
                monthlyPurchase,

                // 2️⃣ COUNTS (long)
                productRepo.countByShop(shop),
                stockRepo.lowStockCount(shop, 5.0),
                customerRepo.countByShop(shop),
                supplierRepo.countByShop(shop),

                // 3️⃣ PROFIT / LOSS
                todayProfit,
                monthlyProfit,

                // 4️⃣ CHARTS
                saleRepo.last7DaysSales(shop, today.minusDays(6)),
                saleRepo.last6MonthsSales(shop, today.minusMonths(5)),
                saleRepo.top5SellingProducts(shop, PageRequest.of(0, 5)),

                // 5️⃣ TABLE DATA
                stockRepo.lowStockProducts(shop, 5.0),
                saleRepo.recentSales(shop),
                purchaseRepo.recentPurchases(shop)
        );
    }
}
