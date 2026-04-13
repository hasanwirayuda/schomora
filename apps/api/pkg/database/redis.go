package database

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var Redis *redis.Client

func ConnectRedis() {
    opt, err := redis.ParseURL(os.Getenv("REDIS_URL"))
    if err != nil {
        log.Fatal("Failed to parse REDIS_URL:", err)
    }

    Redis = redis.NewClient(opt)

    // Test koneksi
    ctx := context.Background()
    if err := Redis.Ping(ctx).Err(); err != nil {
        log.Fatal("Failed to connect to Redis:", err)
    }

    log.Println("Redis connected successfully")
}