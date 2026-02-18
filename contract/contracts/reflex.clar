;; Stacks Reflex - on-chain leaderboard for the reflex game.
;; Players submit their best reaction-time score in milliseconds (lower = better).
;; Top 10 leaderboard stored on-chain.

(define-constant EMPTY 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

(define-map best-score (principal) uint)

(define-data-var leaderboard
  (list 10 (tuple (who principal) (score uint)))
  (list
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))
    (tuple (who EMPTY) (score u0))))

(define-read-only (get-leaderboard)
  (var-get leaderboard))

(define-read-only (get-best-score (who principal))
  (default-to u0 (map-get? best-score who)))

;; Index of the worst (highest) score in the list - that slot gets replaced when full. Lower score = better.
(define-private (worst-score-index (lst (list 10 (tuple (who principal) (score uint)))) (i uint) (cur-max uint) (cur-idx uint))
  (if (< i (len lst))
    (let ((e (element-at lst i)))
      (if (and (not (is-eq (get who e) EMPTY)) (> (get score e) cur-max))
        (worst-score-index lst (+ i u1) (get score e) i)
        (worst-score-index lst (+ i u1) cur-max cur-idx)))
    cur-idx))

;; Replace element at idx with entry; return new list.
(define-private (list-replace (lst (list 10 (tuple (who principal) (score uint)))) (idx uint) (entry (tuple (who principal) (score uint))))
  (list
    (if (is-eq idx u0) entry (element-at lst u0))
    (if (is-eq idx u1) entry (element-at lst u1))
    (if (is-eq idx u2) entry (element-at lst u2))
    (if (is-eq idx u3) entry (element-at lst u3))
    (if (is-eq idx u4) entry (element-at lst u4))
    (if (is-eq idx u5) entry (element-at lst u5))
    (if (is-eq idx u6) entry (element-at lst u6))
    (if (is-eq idx u7) entry (element-at lst u7))
    (if (is-eq idx u8) entry (element-at lst u8))
    (if (is-eq idx u9) entry (element-at lst u9))))

;; Find first index where who is EMPTY (empty slot).
(define-private (first-empty-index (lst (list 10 (tuple (who principal) (score uint)))) (i uint))
  (if (>= i (len lst))
    u9
    (let ((e (element-at lst i)))
      (if (is-eq (get who e) EMPTY) i (first-empty-index lst (+ i u1))))))

;; Returns (some index) if principal is in list, (none) otherwise.
(define-private (index-of-principal (lst (list 10 (tuple (who principal) (score uint)))) (target principal) (i uint))
  (if (>= i (len lst))
    (none)
    (let ((e (element-at lst i)))
      (if (is-eq (get who e) target) (some i) (index-of-principal lst target (+ i u1))))))

;; Single private that computes new leaderboard so the checker sees a linear call graph.
(define-private (compute-new-leaderboard (lb (list 10 (tuple (who principal) (score uint)))) (entry (tuple (who principal) (score uint))) (sender principal))
  (let ((idx-opt (index-of-principal lb sender u0)))
    (if (is-some idx-opt)
      (list-replace lb (unwrap idx-opt) entry)
      (if (is-eq (get who (element-at lb (first-empty-index lb u0))) EMPTY)
        (list-replace lb (first-empty-index lb u0) entry)
        (let ((worst-idx (worst-score-index lb u0 u0 u0)) (worst-score (get score (element-at lb worst-idx))))
          (if (< (get score entry) worst-score)
            (list-replace lb worst-idx entry)
            lb))))))

(define-public (submit-score (score uint))
  (let (
    (sender (tx-sender))
    (current (default-to u0 (map-get? best-score sender)))
    (new-best (if (or (is-eq current u0) (< score current)) score current))
    (lb (var-get leaderboard))
    (entry (tuple (who sender) (score new-best)))
  )
  (asserts! (> score u0) (err u1))
  (map-set best-score sender new-best)
  (var-set leaderboard (compute-new-leaderboard lb entry sender))
  (ok true)))
