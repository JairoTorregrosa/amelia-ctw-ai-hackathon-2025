-- Define possible roles within the application
CREATE TYPE user_role AS ENUM ('patient', 'therapist');

-- Define who sends a message in a conversation
CREATE TYPE message_sender AS ENUM ('agent', 'patient');
