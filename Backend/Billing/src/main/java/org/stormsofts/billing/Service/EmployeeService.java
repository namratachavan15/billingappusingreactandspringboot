package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Employee;
import java.util.List;

public interface EmployeeService {

    List<Employee> getAll();

    Employee save(Employee emp);

    Employee update(Long id, Employee emp);

    void delete(Long id);

    List<Employee> search(String key);
}
