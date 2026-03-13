dev:
	.venv/bin/uvicorn backend.main:app --reload

run:
	.venv/bin/uvicorn backend.main:app