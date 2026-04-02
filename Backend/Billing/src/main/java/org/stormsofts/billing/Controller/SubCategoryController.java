package org.stormsofts.billing.Controller;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.SubCategoryService;
import org.stormsofts.billing.model.SubCategory;

import java.util.List;

@RestController
@RequestMapping("/api/sub-categories")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class SubCategoryController {

    @Autowired
    private  SubCategoryService service;

    @GetMapping
    public List<SubCategory> getAll() {
        return service.getAllSubCategories();
    }

    @GetMapping("/search")
    public List<SubCategory> search(@RequestParam String keyword) {
        return service.searchSubCategories(keyword);
    }

    @GetMapping("/{id}")
    public SubCategory getById(@PathVariable Long id) {
        return service.getSubCategoryById(id);
    }

    @PostMapping
    public SubCategory create(@RequestBody SubCategory subCategory) {
        return service.saveSubCategory(subCategory);
    }

    @PutMapping("/{id}")
    public SubCategory update(@PathVariable Long id, @RequestBody SubCategory subCategory) {
        return service.updateSubCategory(id, subCategory);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteSubCategory(id);
    }
}
