package com.fastrecklessbank.bank.service;

import com.fastrecklessbank.bank.exception.AccountNotFoundException;
import com.fastrecklessbank.bank.exception.InsufficientFundsException;
import com.fastrecklessbank.bank.model.Account;
import com.fastrecklessbank.bank.model.OutgoingTransfer;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AccountService {

    private final Map<UUID, Account> accounts = new ConcurrentHashMap<>();

    public Account createAccount() {
        Account account = new Account();
        accounts.put(account.getId(), account);
        return account;
    }

    public Account getAccount(UUID id) {
        return accounts.get(id);
    }

    public void deposit(UUID id, BigDecimal amount) {

        // making sure the amount is positive 
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        Account account = getAccount(id);

        // ID validation 
        if (account == null) {
            throw new AccountNotFoundException(id);
        }

        account.getLock().lock();
        try {
            account.deposit(amount);
        } finally {
            account.getLock().unlock();
        }
    }
    

    public void withdraw(UUID id, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        Account account = getAccount(id);
        if (account == null) {
            throw new AccountNotFoundException(id);
        }

        account.getLock().lock();
        try {
            if (account.getBalance().compareTo(amount) < 0) {
                throw new InsufficientFundsException();
            }
            account.withdraw(amount);
        } finally {
            account.getLock().unlock();
        }
    }
    
    public void transfer(UUID fromId, UUID toId, BigDecimal amount) {
        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("Cannot transfer to same account");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        Account from = getAccount(fromId);
        Account to = getAccount(toId);

        if (from == null)
            throw new AccountNotFoundException(fromId);
        if (to == null)
            throw new AccountNotFoundException(toId);

        Account first = fromId.compareTo(toId) < 0 ? from : to;
        Account second = fromId.compareTo(toId) < 0 ? to : from;

        first.getLock().lock();
        second.getLock().lock();
        try {
            if (from.getBalance().compareTo(amount) < 0) {
                throw new InsufficientFundsException();
            }

            from.withdraw(amount);
            to.deposit(amount);

            // record outgoing transfer 
            from.addOutgoingTransfer(
                    new OutgoingTransfer(toId, amount, Instant.now()));
        } finally {
            second.getLock().unlock();
            first.getLock().unlock();
        }
    }

    public Collection<Account> getAllAccounts() {
        return accounts.values();
    }

    
}
