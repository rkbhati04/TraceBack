package com.traceback.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.traceback.backend.exception.ResourceNotFoundException;
import com.traceback.backend.model.Item;
import com.traceback.backend.repository.ItemRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository repo;

    private Item findItemOrThrow(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + id));
    }

    public Item addItem(Item item) {
        return repo.save(item);
    }

    public List<Item> getItems() {
        return repo.findAll();
    }

    public Item getItemById(Long id) {
        return findItemOrThrow(id);
    }

    public void deleteItem(Long id) {
        Item item = findItemOrThrow(id);
        repo.delete(item);
    }

    public Item update(Long id, Item newItem) {
        Item item = findItemOrThrow(id);
        
        item.setTitle(newItem.getTitle());
        item.setDescription(newItem.getDescription());
        item.setType(newItem.getType());
        item.setCategory(newItem.getCategory());
        item.setLocation(newItem.getLocation());
        item.setDateOccurred(newItem.getDateOccurred());
        item.setStatus(newItem.getStatus());
        item.setImageUrl(newItem.getImageUrl());
        
        return repo.save(item);
    }
}

