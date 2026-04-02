package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.MainCategoryService;
import org.stormsofts.billing.model.MainCategory;

import java.util.List;

@RestController
@RequestMapping("/api/main-categories")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class MainCategoryController {

    @Autowired
    private  MainCategoryService service;

    @GetMapping
    public List<MainCategory> getAll() {
        return service.getAllMainCategories();
    }

    @GetMapping("/search")
    public List<MainCategory> search(@RequestParam String keyword) {
        return service.searchMainCategories(keyword);
    }

    @GetMapping("/{id}")
    public MainCategory getById(@PathVariable Long id) {
        return service.getMainCategoryById(id);
    }

    @PostMapping
    public MainCategory create(@RequestBody MainCategory category) {
        return service.saveMainCategory(category);
    }

    @PutMapping("/{id}")
    public MainCategory update(@PathVariable Long id, @RequestBody MainCategory category) {
        return service.updateMainCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteMainCategory(id);
    }
}
