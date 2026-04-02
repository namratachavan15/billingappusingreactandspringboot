package org.stormsofts.billing.Service;



import org.stormsofts.billing.model.MainCategory;

import java.util.List;

public interface MainCategoryService {
    List<MainCategory> getAllMainCategories();
    List<MainCategory> searchMainCategories(String keyword);
    MainCategory getMainCategoryById(Long id);
    MainCategory saveMainCategory(MainCategory category);
    MainCategory updateMainCategory(Long id, MainCategory category);
    void deleteMainCategory(Long id);
}
