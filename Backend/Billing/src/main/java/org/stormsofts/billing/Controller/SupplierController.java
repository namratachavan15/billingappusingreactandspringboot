package org.stormsofts.billing.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.SupplierService;
import org.stormsofts.billing.model.Supplier;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class SupplierController {

    @Autowired
    private SupplierService service;

    @GetMapping
    public List<Supplier> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Supplier save(@RequestBody Supplier sup) {
        return service.save(sup);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier sup) {
        return service.update(id, sup);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/search")
    public List<Supplier> search(@RequestParam String key) {
        return service.search(key);
    }

}
