from redis_config import redis_client

redis_client.set("test", "Hello Redis")

print(redis_client.get("test"))