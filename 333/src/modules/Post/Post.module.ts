
import { Database } from "bun:sqlite";
import { Hono } from "hono";
import { PostRepository } from "./Post.repository";
import { PostController } from "./Post.controller";

export class UsersModule {
  private readonly repository: PostRepository;

  private readonly postController: PostController;

  constructor(database: Database) {
    this.repository = new PostRepository(database);
    this.postController = new PostController(this.repository);
  }

  public init(): Hono{
    this.repository.init();

    return this.postController.routes();
  }
}
  
