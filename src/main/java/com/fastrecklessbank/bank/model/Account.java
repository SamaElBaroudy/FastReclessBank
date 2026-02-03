package com.fastrecklessbank.bank.model;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

public class Account {

    private final UUID id;
    private BigDecimal balance;
    private final ReentrantLock lock = new ReentrantLock();
    
    // ring buffer to save the 50 last outgoing transfer
    private final OutgoingTransfer[] transfers = new OutgoingTransfer[50];
    private int transferIndex = 0;
    private int transferCount = 0;

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

    // adding the outgoing transfer to the buffer 
    public void addOutgoingTransfer(OutgoingTransfer transfer) {
        transfers[transferIndex] = transfer;
        // index will start over when reaching the end of the buffer 
        transferIndex = (transferIndex + 1) % transfers.length;
        // count is maximum 50
        transferCount = Math.min(transferCount + 1, transfers.length);  

    }
    
    public OutgoingTransfer[] getLastOutgoingTransfers() {

        OutgoingTransfer[] result = new OutgoingTransfer[transferCount];
        // transfering from new to old  
        for (int i = 0; i < transferCount; i++) {
            // iterating backward 
            int idx = (transferIndex - 1 - i + transfers.length) % transfers.length; 
            result[i] = transfers[idx];
        }
        return result;
    }
}
