package org.stormsofts.billing.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "size_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SizeMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sizeId;

    // Mapping to UnitMaster
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    @JsonBackReference
    private UnitMaster unit;

    @Column(nullable = false)
    private Double sizeValue; // Numeric value for calculations

    @Column(nullable = false, length = 50)
    private String sizeDisplay; // Text to show in dropdown (e.g., "1 LTR", "500 GM")

    public Long getSizeId() {
        return sizeId;
    }

    public void setSizeId(Long sizeId) {
        this.sizeId = sizeId;
    }

    public UnitMaster getUnit() {
        return unit;
    }

    public void setUnit(UnitMaster unit) {
        this.unit = unit;
    }

    public Double getSizeValue() {
        return sizeValue;
    }

    public void setSizeValue(Double sizeValue) {
        this.sizeValue = sizeValue;
    }

    public String getSizeDisplay() {
        return sizeDisplay;
    }

    public void setSizeDisplay(String sizeDisplay) {
        this.sizeDisplay = sizeDisplay;
    }
}
