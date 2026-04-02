package org.stormsofts.billing.Service;



import org.stormsofts.billing.model.SubCategory;
import java.util.List;

public interface SubCategoryService {
    List<SubCategory> getAllSubCategories();
    List<SubCategory> searchSubCategories(String keyword);
    SubCategory getSubCategoryById(Long id);
    SubCategory saveSubCategory(SubCategory subCategory);
    SubCategory updateSubCategory(Long id, SubCategory subCategory);
    void deleteSubCategory(Long id);
}
