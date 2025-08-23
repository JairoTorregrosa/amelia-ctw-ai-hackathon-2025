import os
import sys
from typing import Optional

from dotenv import find_dotenv, load_dotenv
from openai import OpenAI


def get_env(name: str) -> Optional[str]:
    return os.environ.get(name)


def build_client() -> OpenAI:
    # Load environment variables from .env if present
    load_dotenv(find_dotenv(), override=False)

    api_key = get_env("OPENROUTER_API_KEY")
    if not api_key:
        print(
            "ERROR: OPENROUTER_API_KEY is not set.\n"
            "- Create an API key at https://openrouter.ai/keys\n"
            '- Then export it, e.g.: export OPENROUTER_API_KEY="sk-or-..."',
            file=sys.stderr,
        )
        sys.exit(1)

    base_url = get_env("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1"

    # Optional but recommended headers for OpenRouter usage attribution
    default_headers = {
        "HTTP-Referer": get_env("OPENROUTER_HTTP_REFERER") or "http://localhost",
        "X-Title": get_env("OPENROUTER_APP_TITLE") or "Amelia OpenRouter Test",
    }

    client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        default_headers=default_headers,
        timeout=30.0,
        max_retries=2,
    )
    return client


def run_test_prompt() -> str:
    client = build_client()

    model = get_env("OPENROUTER_MODEL") or "openrouter/auto"
    user_prompt = "Say 'OpenRouter is working' in one short sentence."

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a concise assistant."},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    # Extract text from the first choice
    text = response.choices[0].message.content if response.choices else ""
    return (text or "").strip()


def main() -> None:
    try:
        text = run_test_prompt()
        print("OpenRouter response:\n")
        print(text or "<no-content>")
    except Exception as exc:  # Fallback catch for clarity in a demo script
        print(f"Unexpected error: {exc}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
