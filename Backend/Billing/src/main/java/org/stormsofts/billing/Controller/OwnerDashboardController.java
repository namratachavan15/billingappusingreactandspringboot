package org.stormsofts.billing.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.OwnerDashboardService;
import org.stormsofts.billing.model.OwnerDashboardResponse;

@RestController
@RequestMapping("/api/owner/dashboard")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class OwnerDashboardController {

    @Autowired
    private  OwnerDashboardService dashboardService;

    @GetMapping
    public OwnerDashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }
}

