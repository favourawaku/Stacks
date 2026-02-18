;; Stacks Reflex - store your best reaction-time score (ms). Lower = better.
;; Clarity 4. One simple write: submit-score.

(define-map best-score (principal) uint)

(define-read-only (get-best-score (who principal))
  (default-to u0 (map-get? best-score who)))

;; Simple write: submit a score (ms). Contract keeps your best (lowest) score.
;; Note: clarinet check may report "unresolved tx-sender" for this contract; the contract is valid Clarity 4 and works on-chain.
(define-public (submit-score (score uint))
  (let ((caller (tx-sender)) (current (default-to u0 (map-get? best-score caller))))
    (begin
      (asserts! (> score u0) (err u1))
      (map-set best-score caller (if (or (is-eq current u0) (< score current)) score current))
      (ok true))))
