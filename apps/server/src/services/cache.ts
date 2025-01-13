import Redis from "ioredis";
import { Config } from "../config";

export interface Cache {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T, ttl: number): Promise<void>;
	delete(key: string): Promise<number>;
}

export class RedisCache implements Cache {
	redis: Redis;

	constructor(config: Config) {
		this.redis = new Redis(config.cache.port, config.cache.host);
	}

	async get<T>(key: string): Promise<T | null> {
		const value = await this.redis.get(key);
		return value ? JSON.parse(value) : null;
	}

	async set<T>(key: string, value: T, ttl: number): Promise<void> {
		await this.redis.set(key, JSON.stringify(value), "EX", ttl);
	}

	async delete(key: string): Promise<number> {
		return this.redis.del(key);
	}

	async connect(): Promise<void> {}
	async disconnect(): Promise<void> {}
}
