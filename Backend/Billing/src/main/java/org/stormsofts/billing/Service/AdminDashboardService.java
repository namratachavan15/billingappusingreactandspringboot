package org.stormsofts.billing.Service;


import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.stormsofts.billing.Repository.*;
import org.stormsofts.billing.model.*;


import java.time.LocalDate;
import java.util.List;

@Service
//@RequiredArgsConstructor
@Data
public class AdminDashboardService {

    private final SaleRepository saleRepo;
    private final PurchaseRepository purchaseRepo;
    private final ProductRepository productRepo;
    private final CustomerRepository customerRepo;
    private final SupplierRepository supplierRepo;
    private final StockRepository stockRepo;
    private final ShopRepository shopRepo;

    public AdminDashboardService(SaleRepository saleRepo, PurchaseRepository purchaseRepo, ProductRepository productRepo, CustomerRepository customerRepo, SupplierRepository supplierRepo, StockRepository stockRepo, ShopRepository shopRepo) {
        this.saleRepo = saleRepo;
        this.purchaseRepo = purchaseRepo;
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
        this.supplierRepo = supplierRepo;
        this.stockRepo = stockRepo;
        this.shopRepo = shopRepo;
    }

    public AdminDashboardResponse getDashboard() {

        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        Double todaySales = saleRepo.sumTotalAmountByDate(today);
        Double todayPurchase = purchaseRepo.sumTotalAmountByDate(today);
        Double monthlySales = saleRepo.sumTotalAmountByDateRange(monthStart, today);
        Double monthlyPurchase = purchaseRepo.sumTotalAmountByDateRange(monthStart, today);


        // ✅ Null safety
        todaySales = todaySales != null ? todaySales : 0.0;
        todayPurchase = todayPurchase != null ? todayPurchase : 0.0;
        monthlySales = monthlySales != null ? monthlySales : 0.0;
        monthlyPurchase = monthlyPurchase != null ? monthlyPurchase : 0.0;

        Double todayProfit = todaySales - todayPurchase;
        Double monthlyProfit = monthlySales - monthlyPurchase;

        Long totalShops = shopRepo.count();
        Long totalProducts = productRepo.count();
        Long totalCustomers = customerRepo.count();
        Long totalSuppliers = supplierRepo.count();

        List<ShopLowStockDTO> lowStockByShop =
                stockRepo.findLowStockGroupedByShop(5.0);

        List<ShopRecentSaleDTO> recentSalesByShop =
                saleRepo.findRecentSalesGroupedByShop();

        List<ShopRecentPurchaseDTO> recentPurchasesByShop =
                purchaseRepo.findRecentPurchasesGroupedByShop();

        List<ShopSalesSummaryDTO> topShopsBySales =
                saleRepo.findTopShopsBySales(PageRequest.of(0, 5));

        return
                new AdminDashboardResponse(
                todaySales,
                todayPurchase,
                todayProfit,
                monthlySales,
                monthlyPurchase,
                monthlyProfit,
                totalShops,
                totalProducts,
                totalCustomers,
                totalSuppliers,
                lowStockByShop,
                recentSalesByShop,
                recentPurchasesByShop,
                topShopsBySales
        );
    }
}
