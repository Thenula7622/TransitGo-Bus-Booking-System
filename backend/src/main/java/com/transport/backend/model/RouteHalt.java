package com.transport.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class RouteHalt {
    private String haltName;
    private Double fareFromOrigin;
    private Integer orderIndex;

    public RouteHalt() {}

    public RouteHalt(String haltName, Double fareFromOrigin, Integer orderIndex) {
        this.haltName = haltName;
        this.fareFromOrigin = fareFromOrigin;
        this.orderIndex = orderIndex;
    }

    public String getHaltName() { return haltName; }
    public void setHaltName(String haltName) { this.haltName = haltName; }

    public Double getFareFromOrigin() { return fareFromOrigin; }
    public void setFareFromOrigin(Double fareFromOrigin) { this.fareFromOrigin = fareFromOrigin; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}