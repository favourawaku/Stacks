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

;; Replace element at idx with entry; return new list. No recursion.
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

(define-public (submit-score (score uint))
  (let (
    (sender (tx-sender))
    (current (default-to u0 (map-get? best-score sender)))
    (new-best (if (or (is-eq current u0) (< score current)) score current))
    (lb (var-get leaderboard))
    (entry (tuple (who sender) (score new-best)))
    ;; Inline: first empty slot index (unrolled 0..9)
    (e0 (element-at lb u0))
    (e1 (element-at lb u1))
    (e2 (element-at lb u2))
    (e3 (element-at lb u3))
    (e4 (element-at lb u4))
    (e5 (element-at lb u5))
    (e6 (element-at lb u6))
    (e7 (element-at lb u7))
    (e8 (element-at lb u8))
    (e9 (element-at lb u9))
    (empty-idx (if (is-eq (get who e0) EMPTY) u0
      (if (is-eq (get who e1) EMPTY) u1
      (if (is-eq (get who e2) EMPTY) u2
      (if (is-eq (get who e3) EMPTY) u3
      (if (is-eq (get who e4) EMPTY) u4
      (if (is-eq (get who e5) EMPTY) u5
      (if (is-eq (get who e6) EMPTY) u6
      (if (is-eq (get who e7) EMPTY) u7
      (if (is-eq (get who e8) EMPTY) u8
      (if (is-eq (get who e9) EMPTY) u9 u9))))))))))
    ;; Inline: index of sender in list, or u9 if not found
    (idx-found (if (is-eq (get who e0) sender) u0
      (if (is-eq (get who e1) sender) u1
      (if (is-eq (get who e2) sender) u2
      (if (is-eq (get who e3) sender) u3
      (if (is-eq (get who e4) sender) u4
      (if (is-eq (get who e5) sender) u5
      (if (is-eq (get who e6) sender) u6
      (if (is-eq (get who e7) sender) u7
      (if (is-eq (get who e8) sender) u8
      (if (is-eq (get who e9) sender) u9 u9))))))))))
    (sender-in-list (not (is-eq idx-found u9)))
    ;; Inline: worst (max) score index among non-empty
    (s0 (get score e0))
    (s1 (get score e1))
    (s2 (get score e2))
    (s3 (get score e3))
    (s4 (get score e4))
    (s5 (get score e5))
    (s6 (get score e6))
    (s7 (get score e7))
    (s8 (get score e8))
    (s9 (get score e9))
    (worst-idx (if (and (not (is-eq (get who e0) EMPTY)) (>= s0 s1) (>= s0 s2) (>= s0 s3) (>= s0 s4) (>= s0 s5) (>= s0 s6) (>= s0 s7) (>= s0 s8) (>= s0 s9)) u0
      (if (and (not (is-eq (get who e1) EMPTY)) (>= s1 s0) (>= s1 s2) (>= s1 s3) (>= s1 s4) (>= s1 s5) (>= s1 s6) (>= s1 s7) (>= s1 s8) (>= s1 s9)) u1
      (if (and (not (is-eq (get who e2) EMPTY)) (>= s2 s0) (>= s2 s1) (>= s2 s3) (>= s2 s4) (>= s2 s5) (>= s2 s6) (>= s2 s7) (>= s2 s8) (>= s2 s9)) u2
      (if (and (not (is-eq (get who e3) EMPTY)) (>= s3 s0) (>= s3 s1) (>= s3 s2) (>= s3 s4) (>= s3 s5) (>= s3 s6) (>= s3 s7) (>= s3 s8) (>= s3 s9)) u3
      (if (and (not (is-eq (get who e4) EMPTY)) (>= s4 s0) (>= s4 s1) (>= s4 s2) (>= s4 s3) (>= s4 s5) (>= s4 s6) (>= s4 s7) (>= s4 s8) (>= s4 s9)) u4
      (if (and (not (is-eq (get who e5) EMPTY)) (>= s5 s0) (>= s5 s1) (>= s5 s2) (>= s5 s3) (>= s5 s4) (>= s5 s6) (>= s5 s7) (>= s5 s8) (>= s5 s9)) u5
      (if (and (not (is-eq (get who e6) EMPTY)) (>= s6 s0) (>= s6 s1) (>= s6 s2) (>= s6 s3) (>= s6 s4) (>= s6 s5) (>= s6 s7) (>= s6 s8) (>= s6 s9)) u6
      (if (and (not (is-eq (get who e7) EMPTY)) (>= s7 s0) (>= s7 s1) (>= s7 s2) (>= s7 s3) (>= s7 s4) (>= s7 s5) (>= s7 s6) (>= s7 s8) (>= s7 s9)) u7
      (if (and (not (is-eq (get who e8) EMPTY)) (>= s8 s0) (>= s8 s1) (>= s8 s2) (>= s8 s3) (>= s8 s4) (>= s8 s5) (>= s8 s6) (>= s8 s7) (>= s8 s9)) u8
      (if (and (not (is-eq (get who e9) EMPTY)) (>= s9 s0) (>= s9 s1) (>= s9 s2) (>= s9 s3) (>= s9 s4) (>= s9 s5) (>= s9 s6) (>= s9 s7) (>= s9 s8)) u9 u0))))))))))))
    (worst-score (get score (element-at lb worst-idx)))
    (new-lb (if sender-in-list
      (list-replace lb idx-found entry)
      (if (is-eq (get who (element-at lb empty-idx)) EMPTY)
        (list-replace lb empty-idx entry)
        (if (< new-best worst-score)
          (list-replace lb worst-idx entry)
          lb)))))
  )
  (asserts! (> score u0) (err u1))
  (map-set best-score sender new-best)
  (var-set leaderboard new-lb)
  (ok true)))
