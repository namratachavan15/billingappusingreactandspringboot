package org.stormsofts.billing.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.PurchaseReportRepository;
import org.stormsofts.billing.model.*;

import java.time.LocalDate;
import java.util.List;

@Service
public class PurchaseReportServiceImpl implements PurchaseReportService {
    @Autowired
    private PurchaseReportRepository repo;

    public List<DailyPurchaseReportDTO> dailyReport(Shop shop, LocalDate from, LocalDate to) {
        return repo.getDailyPurchaseReport(shop, from, to);
    }

    public List<MonthlyPurchaseReportDTO> monthlyReport(Shop shop, LocalDate from, LocalDate to) {
        return repo.getMonthlyPurchaseReport(shop, from, to);
    }

    public List<ProductWisePurchaseReportDTO> productWiseReport(Shop shop, LocalDate from, LocalDate to) {
        return repo.getProductWisePurchaseReport(shop, from, to);
    }

    public List<SupplierWisePurchaseReportDTO> supplierWiseReport(Shop shop, LocalDate from, LocalDate to) {
        return repo.getSupplierWisePurchaseReport(shop, from, to);
    }

}
