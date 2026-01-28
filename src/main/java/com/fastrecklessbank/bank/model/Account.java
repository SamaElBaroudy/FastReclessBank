package com.fastrecklessbank.bank.model;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

public class Account {

    private final UUID id;
    private BigDecimal balance;
    private final ReentrantLock lock = new ReentrantLock();

    public Account() {
        this.id = UUID.randomUUID();
        this.balance = BigDecimal.ZERO;
    }

    public UUID getId() {
        return id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }

    public void withdraw(BigDecimal amount) {
        balance = balance.subtract(amount);
    }

    public ReentrantLock getLock() {
        return lock;
    }
}
