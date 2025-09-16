package com.company.project.controllers;

import com.company.project.entity.Greeting;
import com.company.project.repository.GreetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HomeController {

    @Autowired
    private GreetingRepository repository;

    @GetMapping("/")
    public Greeting showHome() {
        return repository.findById(1).orElse(new Greeting("Not Found 😕"));
    }

    @GetMapping("/{id}")
    public Greeting getGreetingById(@PathVariable Integer id) {
        return repository.findById(id).orElse(new Greeting("Not Found 😕"));
    }
}
