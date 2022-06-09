from datetime import datetime
from fastapi import APIRouter, Response, status, Form
import psycopg
from pydantic import BaseModel
from typing import List

class Post(BaseModel):
    post_id: int
    title: str
    text: str
    created_on: datetime
    # upvotes
    # author 

class PostIn(BaseModel):
    title: str
    text: str


class PostList(BaseModel):
    __root__: List[Post]

class Message(BaseModel):
    message:str

router = APIRouter()

@router.get("/api/posts/", response_model = PostList)
def posts_list():
    with psycopg.connect("dbname=forum user=ourspace") as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT post_id, title, text, created_on
                FROM post
                """,
            )

            ds = []
            for row in cur.fetchall():
                d = {
                    "post_id":row[0],
                    "title":row[1],
                    "text":row[2],
                    "created_on":row[3]
                }

                ds.append(d)
            return ds

@router.get(
    "/api/post/{post_id}", 
    response_model=Post,
    responses={404: {"model": Message}},
)
def get_post(post_id: int, response:Response):
    with psycopg.connect() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT post_id, title, text, created_on
                FROM post
                WHERE post_id = %s
            """,
                [post_id],
            )
            row = cur.fetchone()
            if row is None:
                response.status_code = status.HTTP_404_NOT_FOUND
                return {"message": "Category not found"}
            detail = {
                "post_id":row[0],
                "title":row[1],
                "text":row[2],
                "created_on":row[3]
            }
            return detail




@router.post("/api/posts/", response_model = Post)
def new_post(Post: PostIn):
    with psycopg.connect("dbname=forum user=ourspace") as conn:
        with conn.cursor() as cur:
            
            cur.execute(
                """
                INSERT INTO post (post_id, title, text, created_on)
                VALUES (DEFAULT, %s, %s, CURRENT_TIMESTAMP)
                RETURNING post_id, title, text, created_on
                """, 
                [Post.title, Post.text]
            )

            conn.commit()
            
            new_post = cur.fetchone()

            return {
                "post_id": new_post[0],
		        "title": new_post[1],
		        "text": new_post[2],
		        "created_on": new_post[3]
            }
