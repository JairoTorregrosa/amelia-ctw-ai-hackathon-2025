import json
import os
import sys
from typing import Dict, List, Optional

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
        "X-Title": get_env("OPENROUTER_APP_TITLE") or "Amelia Test Generator",
    }

    client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        default_headers=default_headers,
        timeout=30.0,
        max_retries=2,
    )
    return client


def load_amelia_prompt() -> str:
    """Load the Amelia user flow prompt."""
    try:
        with open("/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/prompts/amelia_user_flow.md", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print("ERROR: Could not find amelia_user_flow.md", file=sys.stderr)
        sys.exit(1)


def create_empty_json_files():
    """Create empty JSON files to start with."""
    checkin_file = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_check_in_flow.json"
    crisis_file = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_crisis_flow.json"

    empty_data = {"conversations": []}

    with open(checkin_file, "w", encoding="utf-8") as f:
        json.dump(empty_data, f, ensure_ascii=False, indent=4)

    with open(crisis_file, "w", encoding="utf-8") as f:
        json.dump(empty_data, f, ensure_ascii=False, indent=4)

    print("✅ Created empty JSON files:")
    print(f"  - {checkin_file}")
    print(f"  - {crisis_file}")


def append_conversation_to_file(conversation: List[Dict[str, str]], flow_type: str):
    """Append a single conversation to the appropriate JSON file."""
    if flow_type == "checkin":
        file_path = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_check_in_flow.json"
    else:
        file_path = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_crisis_flow.json"

    # Read existing data
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Append new conversation
    data["conversations"].append(conversation)

    # Write back to file
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"✅ Added conversation {len(data['conversations'])} to {flow_type} file")


def generate_test_checkin_conversation(client: OpenAI, amelia_prompt: str) -> List[Dict[str, str]]:
    """Generate a single test check-in conversation."""
    scenario = {
        "initial_message": "hola amelia, ¿cómo estás?",
        "user_responses": ["8", "ansiedad", "alto: terminé tarea. bajo: pelea", "deadline mañana"],
    }

    conversation = [{"user": scenario["initial_message"]}]
    model = get_env("OPENROUTER_MODEL") or "anthropic/claude-3.5-sonnet"

    messages = [
        {
            "role": "system",
            "content": amelia_prompt
            + '\n\nCurrent state: {"flow":"checkin","asked_suds":false,"asked_high_low":false,"asked_emotion":false}',
        },
        {"role": "user", "content": scenario["initial_message"]},
    ]

    response_index = 0

    for _ in range(8):  # Max 8 turns
        try:
            print(f"  Generating Amelia response...")
            response = client.chat.completions.create(model=model, messages=messages, temperature=0.7, max_tokens=150)

            amelia_response = (response.choices[0].message.content or "").strip().lower()
            conversation.append({"amelia": amelia_response})
            messages.append({"role": "assistant", "content": amelia_response})

            print(f"  Amelia: {amelia_response[:60]}...")

            # Check if conversation should end
            if "gracias" in amelia_response and ("conversación" in amelia_response or "mañana" in amelia_response):
                break

            # Generate user response
            if response_index < len(scenario["user_responses"]):
                user_response = scenario["user_responses"][response_index]
                response_index += 1
            else:
                user_response = "gracias"

            print(f"  User: {user_response}")
            conversation.append({"user": user_response})
            messages.append({"role": "user", "content": user_response})

        except Exception as e:
            print(f"  Error: {e}")
            break

    return conversation


def generate_test_crisis_conversation(client: OpenAI, amelia_prompt: str) -> List[Dict[str, str]]:
    """Generate a single test crisis conversation."""
    scenario = {
        "initial_message": "quiero registrar algo que pasó",
        "responses": {
            "activator": "me dijeron que no pasé a la siguiente ronda",
            "belief": "nunca voy a conseguir trabajo",
            "emotion": "devastación y vergüenza",
            "behavior": "me quedé llorando en el sofá",
            "physical": "dolor en el pecho",
        },
    }

    conversation = [{"user": scenario["initial_message"]}]
    model = get_env("OPENROUTER_MODEL") or "anthropic/claude-3.5-sonnet"

    messages = [
        {"role": "system", "content": amelia_prompt + '\n\nCurrent state: {"flow":"crisis","step":"awaiting_activator"}'},
        {"role": "user", "content": scenario["initial_message"]},
    ]

    # Crisis steps in order
    steps = [
        ("awaiting_activator", scenario["responses"]["activator"]),
        ("awaiting_belief", scenario["responses"]["belief"]),
        ("awaiting_emotion", scenario["responses"]["emotion"]),
        ("awaiting_behavior", scenario["responses"]["behavior"]),
        ("awaiting_physical", scenario["responses"]["physical"]),
    ]

    current_step = 0

    for _ in range(12):  # Max 12 turns
        try:
            # Update system message
            if current_step < len(steps):
                step_name = steps[current_step][0]
                messages[0] = {
                    "role": "system",
                    "content": amelia_prompt + '\n\nCurrent state: {"flow":"crisis","step":"' + step_name + '"}',
                }

            print(f"  Generating Amelia response (step: {step_name if current_step < len(steps) else 'complete'})...")
            response = client.chat.completions.create(model=model, messages=messages, temperature=0.3, max_tokens=100)

            amelia_response = (response.choices[0].message.content or "").strip().lower()
            conversation.append({"amelia": amelia_response})
            messages.append({"role": "assistant", "content": amelia_response})

            print(f"  Amelia: {amelia_response[:60]}...")

            # Check if conversation should end
            if "registro ha terminado" in amelia_response or "proceso de registro ha terminado" in amelia_response:
                break

            # Provide user response
            if current_step < len(steps):
                user_response = steps[current_step][1]
                current_step += 1
            else:
                user_response = "gracias"

            print(f"  User: {user_response}")
            conversation.append({"user": user_response})
            messages.append({"role": "user", "content": user_response})

        except Exception as e:
            print(f"  Error: {e}")
            break

    return conversation


def test_single_conversations():
    """Test generating one conversation of each type."""
    print("🧪 Testing single conversation generation...")

    # Load Amelia prompt
    amelia_prompt = load_amelia_prompt()
    print("✅ Loaded Amelia prompt")

    # Build OpenRouter client
    client = build_client()
    print("✅ OpenRouter client initialized")

    # Create empty JSON files
    create_empty_json_files()

    # Test check-in conversation
    print("\n📞 Testing check-in conversation...")
    try:
        checkin_conversation = generate_test_checkin_conversation(client, amelia_prompt)
        append_conversation_to_file(checkin_conversation, "checkin")
        print(f"✅ Check-in conversation completed ({len(checkin_conversation)} turns)")
    except Exception as e:
        print(f"❌ Error in check-in conversation: {e}")

    # Test crisis conversation
    print("\n🚨 Testing crisis conversation...")
    try:
        crisis_conversation = generate_test_crisis_conversation(client, amelia_prompt)
        append_conversation_to_file(crisis_conversation, "crisis")
        print(f"✅ Crisis conversation completed ({len(crisis_conversation)} turns)")
    except Exception as e:
        print(f"❌ Error in crisis conversation: {e}")

    print("\n🎉 Test completed! Check the JSON files.")


if __name__ == "__main__":
    test_single_conversations()
    test_single_conversations()
