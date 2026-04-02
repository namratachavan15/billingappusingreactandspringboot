package org.stormsofts.billing.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.SaleReportRepository;
import org.stormsofts.billing.model.DailySalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReportServiceImpl implements  ReportService {

    @Autowired
    private SaleReportRepository saleReportRepository;

    @Override
    public List<DailySalesReportDTO> getDailySales(
            Shop shop, LocalDate fromDate, LocalDate toDate) {

        System.out.println("daily report"+saleReportRepository.getDailySalesReport(shop, fromDate, toDate));
        return saleReportRepository.getDailySalesReport(shop, fromDate, toDate);
    }
}
