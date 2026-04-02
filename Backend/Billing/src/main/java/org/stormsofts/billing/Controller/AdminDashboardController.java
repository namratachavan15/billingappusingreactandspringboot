package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.AdminDashboardService;
import org.stormsofts.billing.model.AdminDashboardResponse;

@RestController
@RequestMapping("/api/admin/dashboard")
//@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    public AdminDashboardController(AdminDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public AdminDashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }
}
