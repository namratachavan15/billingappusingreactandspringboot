package org.stormsofts.billing.Controller;

import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.ProfitLossService;
import org.stormsofts.billing.model.ProfitLossDTO;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ProfitLossController {

    private final ProfitLossService profitLossService;

    public ProfitLossController(ProfitLossService profitLossService) {
        this.profitLossService = profitLossService;
    }

    @GetMapping("/profit-loss")
    public List<ProfitLossDTO> getProfitLoss(@RequestParam Long shopId) {
        return profitLossService.getProfitLossByShopId(shopId);
    }
}
