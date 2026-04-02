package org.stormsofts.billing.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.BarcodeService;
import org.stormsofts.billing.Service.SaleService;
import org.stormsofts.billing.model.Sale;

@RestController
@RequestMapping("/api/barcode")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class BarcodeController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private BarcodeService barcodeService;

    @GetMapping("/{billNo}")
    public ResponseEntity<byte[]> getBarcode(@PathVariable String billNo) {
        System.out.println("inside getBarcode");

        Sale sale = saleService.getByBillNo(billNo);

        byte[] image = barcodeService.generateBarcodeImage(sale.getBillNo());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/png")
                .body(image);
    }
}
