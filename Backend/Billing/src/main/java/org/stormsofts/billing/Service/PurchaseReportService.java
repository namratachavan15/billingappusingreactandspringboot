package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.*;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseReportService {
    public List<DailyPurchaseReportDTO> dailyReport(Shop shop, LocalDate from, LocalDate to);
    public List<MonthlyPurchaseReportDTO> monthlyReport(Shop shop, LocalDate from, LocalDate to);
    public List<ProductWisePurchaseReportDTO> productWiseReport(Shop shop, LocalDate from, LocalDate to);
    public List<SupplierWisePurchaseReportDTO> supplierWiseReport(Shop shop, LocalDate from, LocalDate to);
}
