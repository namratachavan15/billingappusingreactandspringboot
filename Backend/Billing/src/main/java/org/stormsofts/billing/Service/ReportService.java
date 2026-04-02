package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.DailySalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    public List<DailySalesReportDTO> getDailySales(
            Shop shop, LocalDate fromDate, LocalDate toDate);

}
