import json
import os
import random
import sys
import time
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
    default_headers = {
        "HTTP-Referer": get_env("OPENROUTER_HTTP_REFERER") or "http://localhost",
        "X-Title": get_env("OPENROUTER_APP_TITLE") or "Amelia Batch Generator",
    }

    client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        default_headers=default_headers,
        timeout=60.0,
        max_retries=3,
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


# Check-in flow scenarios (20 scenarios)
CHECKIN_SCENARIOS = [
    {
        "initial_message": "hola amelia, ¿cómo estás?",
        "user_profile": "anxious_student",
        "responses": [
            "8",
            "ansiedad y estrés",
            "alto: terminé una tarea. bajo: discutí con mi mamá",
            "el deadline de mañana",
            "tenso en los hombros",
            "estudié hasta tarde",
        ],
    },
    {
        "initial_message": "necesito hablar un poco",
        "user_profile": "depressed_worker",
        "responses": [
            "4",
            "tristeza",
            "alto: almorcé bien. bajo: me costó levantarme",
            "trabajo aburrido",
            "pesadez en el pecho",
            "evité llamadas",
        ],
    },
    {
        "initial_message": "aquí andamos",
        "user_profile": "recovering_addict",
        "responses": [
            "6",
            "frustración",
            "alto: fui al gym. bajo: vi a gente bebiendo",
            "fiesta de la oficina",
            "manos sudorosas",
            "me fui temprano",
        ],
    },
    {
        "initial_message": "¿puedes hacerme el check-in?",
        "user_profile": "overwhelmed_parent",
        "responses": [
            "7",
            "cansancio y amor",
            "alto: mi hijo me abrazó. bajo: berrinche en el súper",
            "no dormí bien",
            "dolor de cabeza",
            "grité sin querer",
        ],
    },
    {
        "initial_message": "quiero platicar",
        "user_profile": "grief_processing",
        "responses": [
            "5",
            "nostalgia",
            "alto: encontré fotos bonitas. bajo: su cumpleaños",
            "fecha especial",
            "nudo en la garganta",
            "lloré un rato",
        ],
    },
    {
        "initial_message": "hola",
        "user_profile": "social_anxiety",
        "responses": [
            "3",
            "vergüenza",
            "alto: nadie se burló. bajo: presentación grupal",
            "tengo que hablar en público",
            "mariposas en el estómago",
            "practiqué frente al espejo",
        ],
    },
    {
        "initial_message": "buenas tardes",
        "user_profile": "chronic_pain",
        "responses": [
            "6",
            "irritación",
            "alto: medicamento funcionó. bajo: dolor de espalda",
            "estar sentado mucho tiempo",
            "tensión en todo el cuerpo",
            "tomé descansos",
        ],
    },
    {
        "initial_message": "¿cómo va todo?",
        "user_profile": "relationship_issues",
        "responses": [
            "4",
            "confusión",
            "alto: buena conversación. bajo: otra pelea",
            "malentendido con mi pareja",
            "opresión en el pecho",
            "evité el tema",
        ],
    },
    {
        "initial_message": "necesito el check-in de hoy",
        "user_profile": "work_stress",
        "responses": [
            "8",
            "agobio",
            "alto: completé proyecto. bajo: más trabajo",
            "jefe pidió extra",
            "hombros tensos",
            "trabajé hasta tarde",
        ],
    },
    {
        "initial_message": "aquí estoy",
        "user_profile": "perfectionist",
        "responses": [
            "7",
            "frustración",
            "alto: me felicitaron. bajo: encontré errores",
            "entregué trabajo",
            "dolor de cabeza",
            "revisé todo tres veces",
        ],
    },
    {
        "initial_message": "hola amelia",
        "user_profile": "insomnia",
        "responses": [
            "5",
            "agotamiento",
            "alto: dormí 4 horas. bajo: desvelado otra vez",
            "pensamientos en círculos",
            "ojos pesados",
            "tomé melatonina",
        ],
    },
    {
        "initial_message": "¿podemos hablar?",
        "user_profile": "family_conflict",
        "responses": [
            "6",
            "enojo",
            "alto: papá me entendió. bajo: pelea con hermana",
            "cena familiar",
            "mandíbula apretada",
            "me fui de la mesa",
        ],
    },
    {
        "initial_message": "aquí ando",
        "user_profile": "financial_stress",
        "responses": [
            "7",
            "preocupación",
            "alto: encontré trabajo extra. bajo: llegó la factura",
            "revisé las cuentas",
            "estómago revuelto",
            "busqué alternativas",
        ],
    },
    {
        "initial_message": "necesito hablar",
        "user_profile": "health_anxiety",
        "responses": [
            "8",
            "miedo",
            "alto: examen salió bien. bajo: nuevo síntoma",
            "doctor mencionó análisis",
            "corazón acelerado",
            "busqué en internet",
        ],
    },
    {
        "initial_message": "hola",
        "user_profile": "empty_nest",
        "responses": [
            "4",
            "soledad",
            "alto: hijo me llamó. bajo: casa muy silenciosa",
            "se mudó este mes",
            "vacío en el estómago",
            "limpié su cuarto",
        ],
    },
    {
        "initial_message": "buenas",
        "user_profile": "career_transition",
        "responses": [
            "6",
            "incertidumbre",
            "alto: buena entrevista. bajo: rechazaron otra",
            "cambio de industria",
            "tensión en cuello",
            "actualicé CV",
        ],
    },
    {
        "initial_message": "¿cómo estás tú?",
        "user_profile": "seasonal_depression",
        "responses": ["3", "apatía", "alto: salió el sol. bajo: día gris", "invierno llegó", "pesadez general", "me quedé en cama"],
    },
    {
        "initial_message": "aquí reportándome",
        "user_profile": "eating_disorder",
        "responses": [
            "5",
            "culpa",
            "alto: comí con amigos. bajo: me pesé",
            "comentario sobre mi cuerpo",
            "malestar estomacal",
            "evité el espejo",
        ],
    },
    {
        "initial_message": "necesito el check",
        "user_profile": "ptsd_symptoms",
        "responses": ["7", "alerta", "alto: día tranquilo. bajo: sirena de ambulancia", "sonido fuerte", "sobresalto", "respiré profundo"],
    },
    {
        "initial_message": "hola amelia, ¿cómo va?",
        "user_profile": "adjustment_disorder",
        "responses": [
            "5",
            "extrañeza",
            "alto: conocí a alguien. bajo: todo se siente diferente",
            "mudanza reciente",
            "desorientación",
            "exploré el barrio",
        ],
    },
]

# Crisis log scenarios (20 scenarios)
CRISIS_SCENARIOS = [
    {
        "initial_message": "quiero registrar algo que pasó",
        "scenario": "work_rejection",
        "responses": {
            "activator": "me dijeron que no pasé a la siguiente ronda de la entrevista",
            "belief": "nunca voy a conseguir trabajo, soy un fracaso",
            "emotion": "devastación y vergüenza",
            "behavior": "cerré la laptop y me quedé en el sofá llorando",
            "physical": "dolor en el pecho y manos temblorosas",
        },
    },
    {
        "initial_message": "necesito registrar lo de ayer, fue intenso",
        "scenario": "panic_attack",
        "responses": {
            "activator": "iba en el metro y se detuvo entre estaciones",
            "belief": "me voy a quedar atrapado, algo malo va a pasar",
            "emotion": "pánico y terror",
            "behavior": "empecé a respirar rápido y busqué la salida",
            "physical": "corazón acelerado y sudor frío",
        },
    },
    {
        "initial_message": "quiero documentar lo que pasó en la madrugada",
        "scenario": "nighttime_crisis",
        "responses": {
            "activator": "me desperté y recordé la fecha del aniversario",
            "belief": "nunca voy a superarlo, siempre voy a sentir este dolor",
            "emotion": "tristeza profunda y desesperanza",
            "behavior": "lloré hasta quedarme sin lágrimas",
            "physical": "opresión en el pecho y temblor",
        },
    },
    {
        "initial_message": "necesito registrar una crisis",
        "scenario": "social_rejection",
        "responses": {
            "activator": "mis amigos hicieron planes sin invitarme",
            "belief": "nadie me quiere realmente, soy una carga",
            "emotion": "dolor y abandono",
            "behavior": "borré sus números del teléfono",
            "physical": "nudo en la garganta y vacío en el estómago",
        },
    },
    {
        "initial_message": "lo de anoche necesito registrarlo",
        "scenario": "family_conflict",
        "responses": {
            "activator": "mi mamá me gritó delante de toda la familia",
            "belief": "soy una decepción, nunca hago nada bien",
            "emotion": "humillación y rabia",
            "behavior": "salí de la casa dando un portazo",
            "physical": "cara caliente y puños apretados",
        },
    },
    {
        "initial_message": "quiero registrar lo que pasó en el trabajo",
        "scenario": "public_embarrassment",
        "responses": {
            "activator": "me equivoqué en la presentación frente a todos",
            "belief": "todos piensan que soy incompetente",
            "emotion": "vergüenza y mortificación",
            "behavior": "me disculpé excesivamente y evité contacto visual",
            "physical": "cara roja y voz temblorosa",
        },
    },
    {
        "initial_message": "necesito procesar lo de la cita médica",
        "scenario": "health_scare",
        "responses": {
            "activator": "el doctor dijo que necesitamos más estudios",
            "belief": "tengo algo grave, me voy a morir",
            "emotion": "terror y desesperación",
            "behavior": "busqué síntomas en internet por horas",
            "physical": "mareo y nauseas",
        },
    },
    {
        "initial_message": "quiero registrar el episodio de ayer",
        "scenario": "financial_crisis",
        "responses": {
            "activator": "vi el saldo de mi cuenta bancaria",
            "belief": "nunca voy a salir de esta situación",
            "emotion": "desesperación y pánico",
            "behavior": "calculé gastos obsesivamente hasta las 3am",
            "physical": "dolor de cabeza y tensión en la mandíbula",
        },
    },
    {
        "initial_message": "necesito documentar la crisis de anoche",
        "scenario": "relationship_breakup",
        "responses": {
            "activator": "mi pareja me dijo que ya no siente lo mismo",
            "belief": "nunca voy a encontrar a alguien que me ame",
            "emotion": "dolor desgarrador y vacío",
            "behavior": "revisé todas nuestras fotos y mensajes",
            "physical": "dolor físico en el pecho como si me hubieran partido",
        },
    },
    {
        "initial_message": "quiero registrar lo que pasó con mi hijo",
        "scenario": "parenting_crisis",
        "responses": {
            "activator": "mi hijo adolescente me dijo que me odia",
            "belief": "soy una mala madre, lo estoy dañando",
            "emotion": "culpa aplastante y tristeza",
            "behavior": "lloré en el baño para que no me viera",
            "physical": "sensación de vacío y cansancio extremo",
        },
    },
    {
        "initial_message": "necesito registrar el ataque de hoy",
        "scenario": "ocd_spike",
        "responses": {
            "activator": "toqué la manija de una puerta pública",
            "belief": "me voy a enfermar, voy a contaminar a mi familia",
            "emotion": "ansiedad extrema y asco",
            "behavior": "me lavé las manos hasta que sangraron",
            "physical": "picazón en las manos y náuseas",
        },
    },
    {
        "initial_message": "quiero documentar lo de la universidad",
        "scenario": "academic_failure",
        "responses": {
            "activator": "reprobé el examen final",
            "belief": "soy estúpido, nunca voy a graduarme",
            "emotion": "humillación y desesperanza",
            "behavior": "rompí mis libros y tiré todo al suelo",
            "physical": "temblor en las manos y ganas de vomitar",
        },
    },
    {
        "initial_message": "necesito registrar la recaída",
        "scenario": "addiction_relapse",
        "responses": {
            "activator": "vi a mis amigos bebiendo en la fiesta",
            "belief": "no tengo fuerza de voluntad, siempre voy a fracasar",
            "emotion": "vergüenza y autodesprecio",
            "behavior": "tomé tres copas seguidas",
            "physical": "mareo y sensación de calor",
        },
    },
    {
        "initial_message": "quiero registrar el episodio en el súper",
        "scenario": "agoraphobia_attack",
        "responses": {
            "activator": "había mucha gente y las luces eran muy brillantes",
            "belief": "me voy a desmayar, todos me van a mirar",
            "emotion": "pánico y terror",
            "behavior": "abandoné el carrito y corrí hacia la salida",
            "physical": "respiración entrecortada y vision borrosa",
        },
    },
    {
        "initial_message": "necesito procesar lo de la terapia",
        "scenario": "therapy_breakthrough",
        "responses": {
            "activator": "mi terapeuta me preguntó sobre mi infancia",
            "belief": "todo es mi culpa, merezco lo que me pasó",
            "emotion": "dolor y rabia mezclados",
            "behavior": "salí de la sesión sin despedirme",
            "physical": "temblor en todo el cuerpo y frío",
        },
    },
    {
        "initial_message": "quiero registrar lo del trabajo",
        "scenario": "workplace_harassment",
        "responses": {
            "activator": "mi jefe me gritó delante de todo el equipo",
            "belief": "no valgo nada, merezco que me traten mal",
            "emotion": "humillación e impotencia",
            "behavior": "me quedé callado y fingí que no pasó nada",
            "physical": "nudo en el estómago y ganas de llorar",
        },
    },
    {
        "initial_message": "necesito documentar la pesadilla",
        "scenario": "ptsd_nightmare",
        "responses": {
            "activator": "soñé otra vez con el accidente",
            "belief": "nunca voy a estar seguro, puede pasar otra vez",
            "emotion": "terror e indefensión",
            "behavior": "revisé todas las puertas tres veces",
            "physical": "sudor frío y corazón que no se calma",
        },
    },
    {
        "initial_message": "quiero registrar la crisis de imagen",
        "scenario": "body_dysmorphia",
        "responses": {
            "activator": "me vi en el espejo del ascensor",
            "belief": "soy horrible, nadie me va a amar así",
            "emotion": "asco y desesperación",
            "behavior": "evité todos los espejos el resto del día",
            "physical": "sensación de irrealidad y mareo",
        },
    },
    {
        "initial_message": "necesito procesar lo de mi hermana",
        "scenario": "sibling_comparison",
        "responses": {
            "activator": "mis papás hablaron de los logros de mi hermana",
            "belief": "nunca voy a ser suficiente, soy el fracaso de la familia",
            "emotion": "envidia y tristeza profunda",
            "behavior": "me encerré en mi cuarto y no bajé a cenar",
            "physical": "peso en el pecho y ganas de desaparecer",
        },
    },
    {
        "initial_message": "quiero registrar el episodio de compras",
        "scenario": "impulse_spending",
        "responses": {
            "activator": "me sentía vacía y pasé por la tienda",
            "belief": "comprar algo me va a hacer sentir mejor",
            "emotion": "vacío y urgencia",
            "behavior": "gasté todo mi sueldo en cosas que no necesitaba",
            "physical": "euforia seguida de náuseas y arrepentimiento",
        },
    },
]


def get_conversation_count(flow_type: str) -> int:
    """Get current number of conversations in file."""
    if flow_type == "checkin":
        file_path = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_check_in_flow.json"
    else:
        file_path = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_crisis_flow.json"

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return len(data["conversations"])
    except (FileNotFoundError, json.JSONDecodeError):
        return 0


def append_conversation_to_file(conversation: List[Dict[str, str]], flow_type: str):
    """Append a single conversation to the appropriate JSON file."""
    if flow_type == "checkin":
        file_path = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_check_in_flow.json"
    else:
        file_path = "/Users/jtorregosa/personal/fun/amelia-ctw-ai-hackathon-2025/conversations_crisis_flow.json"

    # Create file if doesn't exist
    if not os.path.exists(file_path):
        empty_data = {"conversations": []}
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(empty_data, f, ensure_ascii=False, indent=4)

    # Read existing data
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Append new conversation
    data["conversations"].append(conversation)

    # Write back to file
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"✅ Added conversation {len(data['conversations'])} to {flow_type} file")


def generate_checkin_conversation(client: OpenAI, amelia_prompt: str, scenario: Dict) -> List[Dict[str, str]]:
    """Generate a check-in conversation."""
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

    for _ in range(10):  # Max 10 turns
        try:
            response = client.chat.completions.create(model=model, messages=messages, temperature=0.7, max_tokens=200)

            amelia_response = (response.choices[0].message.content or "").strip().lower()
            conversation.append({"amelia": amelia_response})
            messages.append({"role": "assistant", "content": amelia_response})

            # Check if conversation should end
            if "gracias" in amelia_response and (
                "conversación" in amelia_response or "mañana" in amelia_response or "cuidate" in amelia_response
            ):
                break

            # Generate user response
            if response_index < len(scenario["responses"]):
                user_response = scenario["responses"][response_index]
                response_index += 1
            else:
                user_response = random.choice(["gracias", "ok", "entiendo", "sí"])

            conversation.append({"user": user_response})
            messages.append({"role": "user", "content": user_response})

            # Small delay to avoid rate limits
            time.sleep(1)

        except Exception as e:
            print(f"  Error: {e}")
            break

    return conversation


def generate_crisis_conversation(client: OpenAI, amelia_prompt: str, scenario: Dict) -> List[Dict[str, str]]:
    """Generate a crisis conversation."""
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

            response = client.chat.completions.create(model=model, messages=messages, temperature=0.3, max_tokens=150)

            amelia_response = (response.choices[0].message.content or "").strip().lower()
            conversation.append({"amelia": amelia_response})
            messages.append({"role": "assistant", "content": amelia_response})

            # Check if conversation should end
            if "registro ha terminado" in amelia_response or "proceso de registro ha terminado" in amelia_response:
                break

            # Provide user response
            if current_step < len(steps):
                user_response = steps[current_step][1]
                current_step += 1
            else:
                user_response = "gracias"

            conversation.append({"user": user_response})
            messages.append({"role": "user", "content": user_response})

            # Small delay to avoid rate limits
            time.sleep(1)

        except Exception as e:
            print(f"  Error: {e}")
            break

    return conversation


def generate_batch_conversations():
    """Generate all remaining conversations incrementally."""
    print("🚀 Starting batch conversation generation...")

    # Load Amelia prompt
    amelia_prompt = load_amelia_prompt()
    print("✅ Loaded Amelia prompt")

    # Build OpenRouter client
    client = build_client()
    print("✅ OpenRouter client initialized")

    # Check current status
    checkin_count = get_conversation_count("checkin")
    crisis_count = get_conversation_count("crisis")

    print("📊 Current status:")
    print(f"  - Check-in conversations: {checkin_count}/20")
    print(f"  - Crisis conversations: {crisis_count}/20")

    # Generate remaining check-in conversations
    if checkin_count < 20:
        print(f"\n📞 Generating remaining check-in conversations ({checkin_count + 1}-20)...")

        for i in range(checkin_count, 20):
            scenario = CHECKIN_SCENARIOS[i]
            print(f"  [{i + 1}/20] {scenario['user_profile']}...")

            try:
                conversation = generate_checkin_conversation(client, amelia_prompt, scenario)
                append_conversation_to_file(conversation, "checkin")
                print(f"    ✅ Completed ({len(conversation)} turns)")
            except Exception as e:
                print(f"    ❌ Failed: {e}")
                break
    else:
        print("✅ All check-in conversations already generated!")

    # Generate remaining crisis conversations
    if crisis_count < 20:
        print(f"\n🚨 Generating remaining crisis conversations ({crisis_count + 1}-20)...")

        for i in range(crisis_count, 20):
            scenario = CRISIS_SCENARIOS[i]
            print(f"  [{i + 1}/20] {scenario['scenario']}...")

            try:
                conversation = generate_crisis_conversation(client, amelia_prompt, scenario)
                append_conversation_to_file(conversation, "crisis")
                print(f"    ✅ Completed ({len(conversation)} turns)")
            except Exception as e:
                print(f"    ❌ Failed: {e}")
                break
    else:
        print("✅ All crisis conversations already generated!")

    # Final status
    final_checkin = get_conversation_count("checkin")
    final_crisis = get_conversation_count("crisis")

    print("\n🎉 Batch generation completed!")
    print("📊 Final status:")
    print(f"  - Check-in conversations: {final_checkin}/20")
    print(f"  - Crisis conversations: {final_crisis}/20")
    print(f"  - Total conversations: {final_checkin + final_crisis}/40")


if __name__ == "__main__":
    generate_batch_conversations()
    generate_batch_conversations()
