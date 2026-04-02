package org.stormsofts.billing.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Repository.UnitMasterRepository;
import org.stormsofts.billing.model.UnitMaster;


import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class UnitMasterController {

    @Autowired
    private UnitMasterRepository repo;

    @GetMapping
    public List<UnitMaster> fetchAll() {
        return repo.findAll();
    }
}
