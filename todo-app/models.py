from pydantic import BaseModel, Field, field_validator


class TodoCreate(BaseModel):
    title: str = Field(max_length=500)
    priority: int = Field(gt=0)

    @field_validator("title")
    @classmethod
    def title_stripped_nonempty(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("title must not be empty or whitespace only")
        return s


class Todo(BaseModel):
    id: int
    title: str
    priority: int
