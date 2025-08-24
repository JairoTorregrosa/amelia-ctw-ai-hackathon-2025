<div align="center">

# Amelia: Conversational Agent


The main objective of Amelia is to transform therapy into a continuous process, providing therapists with the insights they need to prepare more effective sessions and patients with constant conversational support via WhatsApp.


It functions as a digital companion that supports the work of therapists by collecting information about patients' moods, thoughts, and daily challenges between sessions. In this way, Amelia seeks to enhance therapy, allowing subsequent appointments to be more productive, increasing patient loyalty, and reducing the therapist's workload.


<img src="doc/logo_amelia.png" alt="Amelia Logo" width="200"/>


*Built for Hackathon Bogotá 2025 - Best Agentic App in WhatsApp Track*


<img src="doc/logo_hackathon.png" alt="IA Hackathon Logo" width="300"/>


</div>


---


## 💬 **Chat with Amelia now!**


<div align="center">


### 🌟 **Experience the future of mental health care** 🌟


**Ready to meet Amelia? Your therapy companion is just a message away.**


[![Chat with Amelia](https://img.shields.io/badge/💬_Chat_with_Amelia-25D366?style=for-the-badge&logo=whatsapp&logoColor=white&labelColor=075E54)](https://wa.me/573105775035)


📱 **WhatsApp:** [wa.me/573105775031](https://wa.me/573105775031)


*Available 24/7 • Conversations in Spanish • Inter-session support*


</div>


### ⚠️ **Important Notice**

**If Amelia is not responding to your messages, please contact us on LinkedIn:**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Contact_Support-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/torregrosaj/)

**Why?** Users need to be registered in our system for Amelia to function properly. We can't register everyone automatically, so if you're not getting a response, reach out to us and we'll help you get set up!




---


Amelia is an innovative AI companion designed to support psychotherapy patients during the critical period between sessions. By leveraging WhatsApp's 92% penetration rate in Latam, Amelia bridges the gap where 70-80% of patients traditionally abandon therapy after their first session.


## 🎯 Project Overview


### The Problem
- **70-80% therapy dropout rate** between first and second sessions
- **Critical void** in patient support between therapeutic appointments 
- **Lost therapeutic continuity** due to lack of inter-session monitoring
- **Therapist workload** from incomplete patient context at follow-up sessions


### The Solution
Amelia provides:
- **Daily compassionate check-ins** via WhatsApp
- **Crisis intervention** using structured A-B-C logging
- **Automated insight extraction** for therapists
- **Continuous therapeutic support** without replacing professional care


## 🏗️ System Architecture


### Core Components


```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   WhatsApp      │    │     Amelia       │    │   Therapist     │
│   Interface     │◄──►│   AI Agent       │◄──►│   Dashboard     │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        │                        ▼                        │
        │              ┌──────────────────┐               │
        │              │   PostgreSQL     │               │
        └─────────────►│   Database       │◄──────────────┘
                       │                  │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  AI Workflows    │
                       │  (Insight        │
                       │   Processing)    │
                       └──────────────────┘
```


## 🤖 Amelia AI Agent


### Core Capabilities


#### 📋 Daily Check-ins ("Emotional Thermometer")
- **SUDS Scale**: Emotional state quantification (1-10)
- **Daily Highlights**: Best and most challenging moments
- **Values Connection**: Actions aligned with personal values (ACT Framework)
- **Somatic Awareness**: Body sensation monitoring


#### 🚨 Crisis Intervention (A-B-C Model)
- **Activator**: Trigger event identification
- **Beliefs**: Automatic thoughts and interpretations
- **Consequences**: Emotional, behavioral, and physical responses
- **Safety Protocols**: Immediate escalation for high-risk situations


### Key Tables
```sql
profiles                 -- User accounts (patients/therapists)
conversations           -- Chat sessions with auto-management
messages                -- Individual chat messages
conversation_insights   -- AI-extracted insights
insight_types          -- Configurable insight categories
patient_context        -- Comprehensive patient profiles
```


### Insight Processing
- **Primary Emotions**: Ekman's 6 basic emotions extraction
- **Crisis Classification**: Risk assessment with severity levels
- **Conversational Summary**: Key events and developments
- **Mood Classification**: Emotional state tracking over time


## 🌐 Frontend Dashboard


### Next.js Application Features
- **Patient Selection**: Multi-patient therapist interface
- **Date Range Analysis**: Flexible reporting periods
- **Real-time Metrics**:
 - Total conversations
 - Crisis events count
 - Average mood scores 
 - Patient engagement rates
- **Interactive Charts**: Visual insights and trend analysis
- **Patient Summaries**: AI-generated key insights


### Technology Stack
- **Framework**: Next.js 15 with React 19
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Authentication**: Supabase Auth


## 🔄 AI Workflow System


### Insight Processing Pipeline


```
Conversation Complete → Insights Created → AI Processing → Results Stored
                                          │
                           ┌──────────────┴──────────────┐
                           ▼                             ▼
                  ┌─────────────────┐          ┌─────────────────┐
                  │  Primary        │          │  Crisis         │
                  │  Emotions       │          │  Classification │
                  └─────────────────┘          └─────────────────┘
                           │                             │
                           ▼                             ▼
                  ┌─────────────────┐          ┌─────────────────┐
                  │  Conversational │          │  Mood           │
                  │  Summary        │          │  Classification │
                  └─────────────────┘          └─────────────────┘
```


### Workflow Configuration
- **Flexible Prompts**: Markdown-based LLM instructions
- **JSON Schemas**: Structured output validation
- **Example Templates**: Quality assurance references
- **Configurable Types**: Dynamic insight category management


## 📁 Project Structure


```
├── database/                 # PostgreSQL schema and migrations
│   ├── functions/           # Database functions
│   ├── triggers/           # Auto-management triggers
│   └── examples/           # Sample data
├── front/                   # Next.js dashboard application
│   ├── app/                # App router pages
│   ├── components/         # Reusable UI components
│   ├── models/             # Database interaction classes
│   └── types/              # TypeScript definitions
├── workflows/               # AI processing configurations
│   └── raw_insights/       # Insight extraction prompts
├── prompts/                # Amelia conversational prompts
├── examples/               # Sample user profiles and data
└── doc/                    # Documentation and pitch materials
```


## 🚀 Getting Started


### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Supabase account
- WhatsApp Business API (for production)


### Database Setup
```bash
# Apply migrations in order
cd database/
# Follow MIGRATION_ORDER.md for proper sequence
```


### Frontend Development
```bash
cd front/
pnpm install
pnpm dev
```


### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```


## 🎯 Hackathon Achievements


### Innovation & Impact
- **Addresses Critical Gap**: 70-80% therapy dropout prevention
- **Cultural Relevance**: WhatsApp-first approach for Latin America
- **Evidence-Based**: Integrates proven therapeutic frameworks
- **Scalable Solution**: Can serve multiple patients per therapist


### Technical Execution
- **Advanced Database**: Auto-management and insight processing
- **Sophisticated AI**: Multi-modal conversational agent
- **Modern Stack**: Next.js, TypeScript, Supabase integration
- **Workflow Automation**: Configurable AI processing pipelines




## 📊 Key Metrics & Impact


### For Patients
- **Continuous Support**: 24/7 availability between sessions
- **Crisis Management**: Immediate intervention capabilities
- **Progress Tracking**: Mood and engagement monitoring
- **Cultural Adaptation**: Localized communication styles


### For Therapists
- **Enhanced Context**: Rich pre-session patient insights
- **Risk Assessment**: Automated crisis detection
- **Workload Reduction**: Automated data collection and analysis
- **Better Outcomes**: Improved patient retention and engagement


## 🏆 Competition Positioning


**Track**: Best Agentic App in WhatsApp 


**Competitive Advantages**:
- WhatsApp-native experience (92% penetration in Latam)
- Evidence-based therapeutic approaches
- Automated professional-grade insights
- Crisis intervention capabilities
- Cultural and linguistic adaptation


---


## 🚀 **Ready to transform mental health care?**


<div align="center">


---


### 🏆 **Hackathon Bogotá 2025**
*Built with ❤️ for mental health transformation*


**🎯 Mission:** *Empowering mental health care through intelligent conversation* 
**💡 Vision:** *Therapy doesn't end when your session does*


<img src="doc/logo_hackathon.png" alt="IA Hackathon" width="200"/>


*Because every conversation can change a life* 💜


</div>