package com.fastrecklessbank.bank.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OutgoingTransfer(
        UUID toAccountId,
        BigDecimal amount,
        Instant timestamp
) {}
