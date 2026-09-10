package com.transport.backend.repository;

import com.transport.backend.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination);
}