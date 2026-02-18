 clarinet contract new <contract-name>
clarinet deployments apply --mainnet

## Contracts

- **activity** – `record-activity`: increment on-chain check-in count.
- **reflex** – `submit-score (score uint)`: store your best reaction-time (ms). Read with `get-best-score (who principal)`. Clarity 4. If `clarinet check` reports "unresolved tx-sender" for reflex, the contract is still valid and works on-chain (known checker quirk).
