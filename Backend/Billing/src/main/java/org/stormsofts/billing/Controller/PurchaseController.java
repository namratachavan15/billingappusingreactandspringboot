package org.stormsofts.billing.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.stormsofts.billing.Repository.PurchaseItemRepository;
import org.stormsofts.billing.Service.PurchaseService;
import org.stormsofts.billing.model.Purchase;
import org.stormsofts.billing.model.PurchaseItem;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class PurchaseController {
@Autowired
    private  PurchaseService service;
    @Autowired
    private PurchaseItemRepository purchaseItemRepo;

    @GetMapping
    public List<Purchase> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Purchase save(@RequestBody Purchase pur) {
        return service.save(pur);
    }

    @PutMapping("/{id}")
    public Purchase update(@PathVariable Long id, @RequestBody Purchase pur) {
        return service.update(id, pur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/search")
    public List<Purchase> search(@RequestParam String key) {
        return service.search(key);
    }

//    @GetMapping("/stock/{productId}")
//    public Double getAvailableStock(@PathVariable Long productId) {
//        return purchaseItemRepo.sumRemainingQuantityByProductId(productId);
//    }

}
