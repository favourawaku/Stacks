;; On-chain Snake Game (Simple Version)

(define-constant GRID-SIZE u10)

(define-map snakes
  { player: principal }
  { x: uint, y: uint, score: uint, alive: bool }
)

;; Start a new game
(define-public (start-game)
  (begin
    (map-set snakes
      { player: tx-sender }
      {
        x: u5,
        y: u5,
        score: u0,
        alive: true
      }
    )
    (ok "Game Started")
  )
)

;; Move snake
;; direction: 0=up, 1=down, 2=left, 3=right
(define-public (move (direction uint))
  (let (
        (snake (unwrap! 
                (map-get? snakes { player: tx-sender })
                (err "Start game first")))
       )

    (asserts! (get alive snake) (err "You are dead"))

    (let (
          (new-x
            (if (is-eq direction u2)
                (- (get x snake) u1)
                (if (is-eq direction u3)
                    (+ (get x snake) u1)
                    (get x snake))))

          (new-y
            (if (is-eq direction u0)
                (+ (get y snake) u1)
                (if (is-eq direction u1)
                    (- (get y snake) u1)
                    (get y snake))))
         )

      ;; check wall collision
      (if (or
            (>= new-x GRID-SIZE)
            (>= new-y GRID-SIZE)
          )
          ;; Dead
          (begin
            (map-set snakes
              { player: tx-sender }
              {
                x: new-x,
                y: new-y,
                score: (get score snake),
                alive: false
              })
            (err "Hit wall")
          )

          ;; Alive move
          (begin
            (map-set snakes
              { player: tx-sender }
              {
                x: new-x,
                y: new-y,
                score: (+ (get score snake) u1),
                alive: true
              })
            (ok {
                  x: new-x,
                  y: new-y,
                  score: (+ (get score snake) u1)
                })
          )
      )
    )
  )
)

;; Read player state
(define-read-only (get-state (player principal))
  (map-get? snakes { player: player })
)
