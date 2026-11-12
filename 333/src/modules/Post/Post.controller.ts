import type { PostRepository } from "./Post.repository";
import { Context, Hono, type TypedResponse } from "hono";
import {
  IDParamSchema,
  type ApplicationEnviroment,
  type ApplicationResult,
  type IDParamType,
} from "../application.types";
import { PostCreateSchema, type PostType } from "./Post.types";
import { ApplicationValidator } from "../application.validator";

export class PostController {
  private readonly repository: PostRepository;

  constructor(repository: PostRepository) {
    this.repository = repository;
  }

  public routes(): Hono {
    return new Hono()
      .get("/", this.findAll.bind(this))
      .get(
        "/:id",
        ApplicationValidator.validate("param", IDParamSchema),
        this.findOne.bind(this),
      )
      .post('/', ApplicationValidator.validate(target: "json", PostCreateSchema), this.create.bind(this));
  }

  public async findAll(
    c: Context,
  ): Promise<TypedResponse<ApplicationResult<PostType[]>>> {
    return c.json({ success: true, data: this.repository.findAll() });
  }

  public async findOne(
    c: Context<ApplicationEnviroment, "/:id", { out: { param: IDParamType } }>,
  ): Promise<TypedResponse<ApplicationResult<PostType>>> {
    const { id } = c.req.valid("param");
    const Post = this.repository.findById(id);

    if (!Post) {
      return c.json({ success: false, error: "Post not found" }, 404);
    }

    return c.json({ success: true, data: Post });
  }

  public async create(
    c: content <ApplicationEnviroment, "/", {out: { json: PostCreateType}}>
  ):Promise<TypeResponse<ApplicationResult<PostType>>>{
    const {content} = c.req.valid(target:'json');
    const user = c.get("user");
    const post = this.repository.create(content, user.id);

    if (!post){
      return c.json({success: false, error: "Error While Creating Post"}, status: 500);
    }
    return c.json({success: true, data: post})
  }
  }

