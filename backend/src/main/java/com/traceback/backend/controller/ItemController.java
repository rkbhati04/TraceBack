package com.traceback.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.security.Principal;
import com.traceback.backend.dto.ItemRequestDTO;
import com.traceback.backend.dto.ItemResponseDTO;
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
    public ResponseEntity<ItemResponseDTO> addItem(@Valid @RequestBody ItemRequestDTO itemDto, Principal principal){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addItem(itemDto, principal.getName()));
    }
    
    @GetMapping
    public List<ItemResponseDTO> getItems(){
        return service.getItems();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id){
        return ResponseEntity.ok(service.getItemById(id));
    }
    
    @PutMapping("/{id}")
    public ItemResponseDTO updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequestDTO itemDto){
        return service.update(id, itemDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id){
        service.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
