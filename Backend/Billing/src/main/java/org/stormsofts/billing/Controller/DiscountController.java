package org.stormsofts.billing.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.stormsofts.billing.Repository.DiscountRepository;
import org.stormsofts.billing.model.DiscountMaster;

import java.util.List;

@RestController
@RequestMapping("/discounts")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class DiscountController {

    @Autowired
    private DiscountRepository discountRepo;

    @GetMapping
    public List<DiscountMaster> getAll() {
        return discountRepo.findAll();
    }
}
