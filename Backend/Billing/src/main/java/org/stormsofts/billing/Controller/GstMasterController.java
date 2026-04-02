package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Repository.GstMasterRepository;
import org.stormsofts.billing.model.GstMaster;


import java.util.List;

@RestController
@RequestMapping("/api/gst")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class GstMasterController {

    @Autowired
    private GstMasterRepository repo;

    @GetMapping
    public List<GstMaster> fetchAll() {
        return repo.findAll();
    }
}
