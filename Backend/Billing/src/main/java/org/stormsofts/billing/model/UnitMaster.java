package org.stormsofts.billing.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "unit_master")

public class UnitMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long unitId;

    @Column(nullable = false, unique = true)
    private String unitName;

    // One unit can have multiple sizes
    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SizeMaster> sizes;

    public UnitMaster() {
    }

    public UnitMaster(Long unitId, String unitName, List<SizeMaster> sizes) {
        this.unitId = unitId;
        this.unitName = unitName;
        this.sizes = sizes;
    }

    public Long getUnitId() {
        return unitId;
    }

    public void setUnitId(Long unitId) {
        this.unitId = unitId;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public List<SizeMaster> getSizes() {
        return sizes;
    }

    public void setSizes(List<SizeMaster> sizes) {
        this.sizes = sizes;
    }
}
