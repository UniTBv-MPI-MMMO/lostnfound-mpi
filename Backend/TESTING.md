# Testing Evidence

## Test cases covered

### 1. Create item
- Endpoint: `POST /items`
- Validates that a new item can be created successfully.
- Verifies the response status code is `201 Created`.
- Verifies the created item is persisted in the database and the `Location` header is returned.

### 2. List items with filtering
- Endpoint: `GET /items?status=`
- Validates that items can be retrieved from the backend.
- Verifies filtering by `status` works for values such as `lost` and `found`.

### 3. Get item details
- Endpoint: `GET /items/{id}`
- Validates that the backend returns the correct details for a single item.
- Verifies the response for a valid item ID and the `404` response for a missing item.

### 4. Update item status
- Endpoint: `PATCH /items/{id}`
- Validates that an existing item's status can be updated.
- Verifies the updated status is persisted and returned by the API.
- Verifies the `404` response for a missing item.

## Test execution result

Tests were executed in the backend container with:

```bash
docker compose run --rm backend pytest
```

Pytest summary:

```text
8 passed, 2 warnings in 1.15s
```

## Bugs / issues identified during testing

- Initial CI failures happened because the test runner could not import `main` until `Backend/pytest.ini` was updated with `pythonpath = .`.
- The test run shows `DeprecationWarning` messages from FastAPI / Pydantic (`general_plain_validator_function`), but they do not block the tests.
- No functional API defects were found in the current backend test run.
