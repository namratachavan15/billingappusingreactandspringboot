package org.stormsofts.billing.utility;

import java.time.LocalDate;

public class BillNumberGenerator {

    public static String generateBillNo(Long saleId) {
        return "BILL-" + LocalDate.now() + "-" + String.format("%06d", saleId);
    }
}
