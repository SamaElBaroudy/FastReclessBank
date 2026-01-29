package com.fastrecklessbank.bank.controller;

import com.fastrecklessbank.bank.dto.TransferRequest;
import com.fastrecklessbank.bank.model.Account;
import com.fastrecklessbank.bank.service.AccountService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostMapping
    public Account create() {
        return service.createAccount();
    }

    @PostMapping("/{id}/deposit")
    public void deposit(
            @PathVariable UUID id,
            @RequestParam BigDecimal amount
    ) {
        service.deposit(id, amount);
    }

    @PostMapping("/{id}/withdraw")
    public void withdraw(
            @PathVariable UUID id,
            @RequestParam BigDecimal amount
    ) {
        service.withdraw(id, amount);
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequest request) {
        service.transfer(
                request.fromAccountId(),
                request.toAccountId(),
                request.amount());
    }
    
    @GetMapping
    public Collection<Account> getAll() {
        return service.getAllAccounts(); 
    }

}
