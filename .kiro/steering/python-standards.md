---
title: Python Standards
inclusion: always
---

# Python Standards

## Project Structure

```
project/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── services/
│   └── utils/
├── tests/
│   ├── __init__.py
│   ├── test_main.py
│   └── conftest.py
├── requirements.txt
├── requirements-dev.txt
├── pyproject.toml
└── .python-version
```

## Virtual Environments

Always use virtual environments:

```bash
# Create virtual environment
python -m venv .venv

# Activate (macOS/Linux)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## FastAPI Patterns

```python
# main.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(title="Product API", version="1.0.0")

class Product(BaseModel):
    id: str
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    description: Optional[str] = None

@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await fetch_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", response_model=Product, status_code=201)
async def create_product(product: Product):
    created = await save_product(product)
    return created
```

## Type Hints

Always use type hints:

```python
from typing import List, Dict, Optional, Union

# ✅ Good - Type hints everywhere
def process_items(items: List[str], limit: int = 10) -> Dict[str, int]:
    result: Dict[str, int] = {}
    for item in items[:limit]:
        result[item] = len(item)
    return result

# ✅ Good - Optional for nullable values
def find_user(user_id: str) -> Optional[User]:
    user = db.get(user_id)
    return user if user else None

# ❌ Bad - No type hints
def process_items(items, limit=10):
    result = {}
    for item in items[:limit]:
        result[item] = len(item)
    return result
```

## Error Handling

```python
from typing import Union
from dataclasses import dataclass

@dataclass
class Success:
    data: dict

@dataclass
class Error:
    message: str
    code: str

Result = Union[Success, Error]

def fetch_user(user_id: str) -> Result:
    try:
        user = db.query(user_id)
        if not user:
            return Error(message="User not found", code="NOT_FOUND")
        return Success(data=user)
    except DatabaseError as e:
        return Error(message=str(e), code="DATABASE_ERROR")

# Usage
result = fetch_user("123")
if isinstance(result, Success):
    print(result.data)
else:
    print(f"Error: {result.message}")
```

## Pydantic Models

```python
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class User(BaseModel):
    id: str
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    name: str = Field(..., min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=150)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @validator('email')
    def email_must_be_lowercase(cls, v):
        return v.lower()
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

## AWS Lambda Handlers

```python
import json
from typing import Dict, Any
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext

logger = Logger()
tracer = Tracer()

@logger.inject_lambda_context
@tracer.capture_lambda_handler
def handler(event: Dict[str, Any], context: LambdaContext) -> Dict[str, Any]:
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Validate input
        if 'name' not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required field: name'})
            }
        
        # Process request
        result = process_request(body)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(result)
        }
    
    except Exception as e:
        logger.exception("Error processing request")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
```

## Testing with pytest

```python
# tests/test_main.py
import pytest
from src.main import process_items, find_user

def test_process_items():
    items = ['apple', 'banana', 'cherry']
    result = process_items(items, limit=2)
    
    assert len(result) == 2
    assert result['apple'] == 5
    assert result['banana'] == 6

def test_find_user_found():
    user = find_user('123')
    assert user is not None
    assert user.id == '123'

def test_find_user_not_found():
    user = find_user('nonexistent')
    assert user is None

@pytest.fixture
def sample_user():
    return User(id='123', name='John', email='john@example.com')

def test_with_fixture(sample_user):
    assert sample_user.name == 'John'
```

## Async/Await

```python
import asyncio
from typing import List

# ✅ Good - Async for I/O operations
async def fetch_users(user_ids: List[str]) -> List[User]:
    tasks = [fetch_user(uid) for uid in user_ids]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]

async def fetch_user(user_id: str) -> Optional[User]:
    async with httpx.AsyncClient() as client:
        response = await client.get(f'/users/{user_id}')
        if response.status_code == 200:
            return User(**response.json())
        return None
```

## Dependency Injection

```python
from fastapi import Depends
from typing import Annotated

class Database:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
    
    def query(self, sql: str):
        # Execute query
        pass

def get_db() -> Database:
    return Database(connection_string=settings.DATABASE_URL)

@app.get("/users/{user_id}")
async def get_user(
    user_id: str,
    db: Annotated[Database, Depends(get_db)]
):
    user = db.query(f"SELECT * FROM users WHERE id = '{user_id}'")
    return user
```

## Environment Variables

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "Product API"
    database_url: str
    api_key: str
    debug: bool = False
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

## Logging

```python
import logging
from aws_lambda_powertools import Logger

# For Lambda
logger = Logger(service="product-api")

@logger.inject_lambda_context
def handler(event, context):
    logger.info("Processing request", extra={"event": event})
    logger.error("Error occurred", exc_info=True)

# For non-Lambda
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

## Code Style

Use Black, isort, and flake8:

```bash
# Format code
black src/ tests/

# Sort imports
isort src/ tests/

# Lint
flake8 src/ tests/
```

```toml
# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py311']

[tool.isort]
profile = "black"
line_length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
```

## Anti-Patterns

❌ Don't use mutable default arguments
❌ Don't use bare `except:` clauses
❌ Don't use `import *`
❌ Don't use global variables
❌ Don't use `eval()` or `exec()`
❌ Don't ignore type hints
❌ Don't use synchronous I/O in async functions
