package com.transport.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "promo_codes")
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private String description;
    private Double discountPercentage;
    private Double flatDiscountAmount;
    private Double minBookingAmount;
    private Boolean active = true;

    public PromoCode() {}

    public PromoCode(String code, String description, Double discountPercentage, Double flatDiscountAmount, Double minBookingAmount, Boolean active) {
        this.code = code;
        this.description = description;
        this.discountPercentage = discountPercentage;
        this.flatDiscountAmount = flatDiscountAmount;
        this.minBookingAmount = minBookingAmount;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Double getFlatDiscountAmount() { return flatDiscountAmount; }
    public void setFlatDiscountAmount(Double flatDiscountAmount) { this.flatDiscountAmount = flatDiscountAmount; }

    public Double getMinBookingAmount() { return minBookingAmount; }
    public void setMinBookingAmount(Double minBookingAmount) { this.minBookingAmount = minBookingAmount; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}