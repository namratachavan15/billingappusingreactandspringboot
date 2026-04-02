package org.stormsofts.billing.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.SaleReportRepository;
import org.stormsofts.billing.model.MonthlySalesReportDTO;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonthlySalesReportServiceImpl implements MonthlySalesReportService {

    @Autowired
    private  SaleReportRepository repository;

    @Override
    public List<MonthlySalesReportDTO> getMonthlySales(Shop shop, LocalDate fromDate, LocalDate toDate) {


        List<MonthlySalesReportDTO> report = repository.getMonthlySales(shop, fromDate, toDate);

        System.out.println("Monthly Sales Report: " + report);

        return report;
    }
}
