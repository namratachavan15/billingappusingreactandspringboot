package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.MasterCategoryService;
import org.stormsofts.billing.model.MasterCategory;


import java.util.List;

@RestController
@RequestMapping("/api/master-categories")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class MasterCategoryController {

    @Autowired
    private  MasterCategoryService service;

    // ✅ GET ALL
    @GetMapping
    public List<MasterCategory> getAll() {
        return service.getAllCategories();
    }

    // ✅ GET BY SEARCH
    @GetMapping("/search")
    public List<MasterCategory> search(@RequestParam String keyword) {
        return service.searchCategories(keyword);
    }

    // ✅ GET BY ID (optional)
    @GetMapping("/{id}")
    public MasterCategory getById(@PathVariable Long id) {
        return service.getCategoryById(id);
    }

    // POST
    @PostMapping
    public MasterCategory create(@RequestBody MasterCategory category) {
        return service.saveCategory(category);
    }

    // PUT
    @PutMapping("/{id}")
    public MasterCategory update(
            @PathVariable Long id,
            @RequestBody MasterCategory category
    ) {
        return service.updateCategory(id, category);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}
