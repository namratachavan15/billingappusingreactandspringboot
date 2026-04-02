package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.MonthlySalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

public interface MonthlySalesReportService {
    List<MonthlySalesReportDTO> getMonthlySales(Shop shop, LocalDate fromDate, LocalDate toDate);
}
