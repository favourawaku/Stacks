;; On-chain activity tracking. Records user check-ins for engagement and analytics.
;; Deploy and use the app to record activity from the Activity dashboard.

(define-data-var total-check-ins uint u0)

(define-read-only (get-total-check-ins)
  (var-get total-check-ins))

;; Records an activity check-in on-chain. Used by the Activity dashboard.
(define-public (record-activity)
  (begin
    (var-set total-check-ins (+ (var-get total-check-ins) u1))
    (ok true)))
