package org.stormsofts.billing.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.stormsofts.billing.Service.SizeService;
import org.stormsofts.billing.model.SizeMaster;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)

public class SizeController {

    @Autowired
    private SizeService sizeService;

    @GetMapping
    public List<SizeMaster> getAllSizes() {
        return sizeService.getAllSizes();
    }

    @GetMapping("/unit/{unitId}")
    public List<SizeMaster> getSizesByUnit(@PathVariable Long unitId) {
        return sizeService.getSizesByUnit(unitId);
    }
}
