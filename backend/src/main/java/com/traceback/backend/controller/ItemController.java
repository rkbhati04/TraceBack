package com.traceback.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.traceback.backend.model.Item;
import com.traceback.backend.service.ItemService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Item> addItem(@Valid @RequestBody Item item){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addItem(item));
    }
    @GetMapping
    public List<Item> getItems(){
        return service.getItems();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id){
        return ResponseEntity.ok(service.getItemById(id));
    }
    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @Valid @RequestBody Item item){
        return service.update(id,item);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id){
        service.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
