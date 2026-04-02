package org.stormsofts.billing.Controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.ShopService;
import org.stormsofts.billing.Service.SaleService;
import org.stormsofts.billing.model.BillResponse;
import org.stormsofts.billing.model.Sale;
import org.stormsofts.billing.model.Shop;


@RestController
@RequestMapping("/api/bill")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class BillController {

    @Autowired
    private ShopService shopService;

    @Autowired
    private SaleService saleService;

    @GetMapping("/{saleId}")
    public BillResponse generateBill(@PathVariable Long saleId) {

        // ✔ get first shop (single shop system)
//        var shop = shopService.getAllShops(null)
//                .stream()
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Shop not found"));

        // ✔ get sale
        var sale = saleService.getById(saleId);

        return new BillResponse(sale.getShop(),sale);
    }
    @GetMapping("/scan/{billNo}")
    public BillResponse scanBill(@PathVariable String billNo) {

        Sale sale = saleService.getByBillNo(billNo);

//        Shop shop = shopService.getAllShops(null)
//                .stream()
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Shop not found"));

        return new BillResponse(sale.getShop(), sale);
    }
}
