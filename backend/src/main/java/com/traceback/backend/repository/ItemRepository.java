package com.traceback.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.traceback.backend.model.Item;

public interface ItemRepository extends JpaRepository<Item,Long>{

}

