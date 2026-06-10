package com.traceback.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.traceback.backend.dto.ItemRequestDTO;
import com.traceback.backend.dto.ItemResponseDTO;
import com.traceback.backend.dto.UserResponseDTO;
import com.traceback.backend.exception.ResourceNotFoundException;
import com.traceback.backend.model.Item;
import com.traceback.backend.model.User;
import com.traceback.backend.repository.ItemRepository;
import com.traceback.backend.repository.UserRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository repo;

    @Autowired
    private UserRepository userRepository;

    private Item findItemOrThrow(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + id));
    }

    public ItemResponseDTO addItem(ItemRequestDTO itemDto, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Item item = Item.builder()
            .title(itemDto.getTitle())
            .description(itemDto.getDescription())
            .type(itemDto.getType())
            .category(itemDto.getCategory())
            .location(itemDto.getLocation())
            .dateOccurred(itemDto.getDateOccurred())
            .imageUrl(itemDto.getImageUrl())
            .reporter(user)
            .build();

        Item savedItem = repo.save(item);
        return mapToDTO(savedItem);
    }

    public List<ItemResponseDTO> getItems() {
        return repo.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ItemResponseDTO getItemById(Long id) {
        return mapToDTO(findItemOrThrow(id));
    }

    public void deleteItem(Long id) {
        Item item = findItemOrThrow(id);
        repo.delete(item);
    }

    public ItemResponseDTO update(Long id, ItemRequestDTO itemDto) {
        Item item = findItemOrThrow(id);
        
        item.setTitle(itemDto.getTitle());
        item.setDescription(itemDto.getDescription());
        item.setType(itemDto.getType());
        item.setCategory(itemDto.getCategory());
        item.setLocation(itemDto.getLocation());
        item.setDateOccurred(itemDto.getDateOccurred());
        item.setImageUrl(itemDto.getImageUrl());
        
        Item updatedItem = repo.save(item);
        return mapToDTO(updatedItem);
    }

    public ItemResponseDTO mapToDTO(Item item) {
        UserResponseDTO userDto = UserResponseDTO.builder()
            .id(item.getReporter().getId())
            .username(item.getReporter().getUsername())
            .email(item.getReporter().getEmail())
            .phoneNumber(item.getReporter().getPhoneNumber())
            .role(item.getReporter().getRole())
            .createdAt(item.getReporter().getCreatedAt())
            .build();

        return ItemResponseDTO.builder()
            .id(item.getId())
            .title(item.getTitle())
            .description(item.getDescription())
            .type(item.getType())
            .category(item.getCategory())
            .location(item.getLocation())
            .dateOccurred(item.getDateOccurred())
            .status(item.getStatus())
            .imageUrl(item.getImageUrl())
            .reporter(userDto)
            .createdAt(item.getCreatedAt())
            .updatedAt(item.getUpdatedAt())
            .build();
    }
}
