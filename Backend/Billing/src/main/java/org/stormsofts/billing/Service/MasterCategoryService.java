package org.stormsofts.billing.Service;



import org.stormsofts.billing.model.MasterCategory;

import java.util.List;

public interface MasterCategoryService {

    List<MasterCategory> getAllCategories();

    List<MasterCategory> searchCategories(String keyword);

    MasterCategory getCategoryById(Long id);

    MasterCategory saveCategory(MasterCategory category);

    MasterCategory updateCategory(Long id, MasterCategory category);

    void deleteCategory(Long id);
}
