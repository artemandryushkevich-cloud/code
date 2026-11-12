import { Database } from "bun:sqlite";
import { type PostType } from "./Post.types";

export class PostRepository {
  constructor(private readonly database: Database) { }

  public init(): void {
    this.database.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        userId Integer NOT NULL,
Foreign key (userId) References users (id) on delete cascade
      );
    `);
  }

  public findAll(): PostType[] {
    return this.database.query<PostType, []>("SELECT * FROM posts").all();
  }

  public findById(id: number): PostType | null {
    return this.database
      .query<PostType, [number]>("SELECT * FROM posts WHERE id = ?")
      .get(id);
  }


  public create(content: string, userId: number): PostType | null {
    return this.database
      .query<
        PostType,
      [string, number]
      >("INSERT INTO Post (content, userId) VALUES (?, ?, ?) RETURNING id, content")
      .get(content, userId);
  }
}
