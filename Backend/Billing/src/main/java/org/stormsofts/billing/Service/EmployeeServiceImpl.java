package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.EmployeeRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.Employee;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository repo;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private  HttpServletRequest request;   // ✅ inject request

    // ✅ REPLACED METHOD
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @Override
    public List<Employee> getAll() {
        return repo.findByShop(getCurrentShop());
    }

    @Override
    public Employee save(Employee emp) {
        emp.setJoinDate(emp.getJoinDate() == null ? LocalDate.now() : emp.getJoinDate());
        emp.setStatus(emp.getStatus() == null ? true : emp.getStatus());
        emp.setShop(getCurrentShop()); // assign shop
        return repo.save(emp);
    }

    @Override
    public Employee update(Long id, Employee emp) {
        Employee db = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        db.setName(emp.getName());
        db.setRole(emp.getRole());
        db.setMob(emp.getMob());
        db.setEmail(emp.getEmail());
        db.setSalary(emp.getSalary());
        db.setJoinDate(emp.getJoinDate());
        db.setShift(emp.getShift());
        db.setStatus(emp.getStatus());
        db.setShop(getCurrentShop()); // keep shop updated

        return repo.save(db);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Employee> search(String key) {
        return repo.searchByShop(getCurrentShop(), key);
    }
}
