package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.SaleService;
import org.stormsofts.billing.model.Sale;


import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class SaleController {

    @Autowired
    private SaleService service;

    // GET all sales
    @GetMapping
    public List<Sale> getAll() {
        return service.getAll();
    }

    // GET sale by ID
    @GetMapping("/{id}")
    public Sale getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ADD sale
    @PostMapping
    public Sale save(@RequestBody Sale sale) {
        return service.save(sale);
    }

    // UPDATE sale
    @PutMapping("/{id}")
    public Sale update(@PathVariable Long id, @RequestBody Sale sale) {
        return service.update(id, sale);
    }

    // DELETE sale
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // SEARCH by customer name or date
    @GetMapping("/search")
    public List<Sale> search(@RequestParam String key) {
        return service.search(key);
    }
}
