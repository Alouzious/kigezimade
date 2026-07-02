use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::error::{AppError, AppResult};

const GROQ_API_URL: &str = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL: &str = "llama-3.3-70b-versatile";

#[derive(Clone)]
pub struct GroqClient {
    client: Client,
    api_key: String,
    model: String,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Deserialize)]
struct ChatChoice {
    message: ChatResponseMessage,
}

#[derive(Deserialize)]
struct ChatResponseMessage {
    content: String,
}

impl GroqClient {
    pub fn new(api_key: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
            model: DEFAULT_MODEL.to_string(),
        }
    }

    pub async fn generate_story(
        &self,
        product_name: &str,
        product_description: &str,
        artisan_name: &str,
        artisan_bio: &str,
        craft_specialty: &str,
        district: &str,
    ) -> AppResult<String> {
        let prompt = format!(
            "You are a cultural storyteller for Kigezi Made, a platform connecting Ugandan artisans \
            in the Kigezi sub-region with tourists and buyers.\n\n\
            Write a rich, evocative 2-3 paragraph story about this handmade craft. \
            Cover: how it was made, who made it, and its cultural meaning in Bakiga/Bafumbira heritage. \
            Be warm and authentic — like a National Geographic feature, not marketing copy. \
            Do not use bullet points or headers.\n\n\
            Product: {product_name}\n\
            Description: {product_description}\n\
            Artisan: {artisan_name}\n\
            Artisan bio: {artisan_bio}\n\
            Craft specialty: {craft_specialty}\n\
            District: {district}, Southwest Uganda"
        );

        self.chat(&prompt).await
    }

    pub async fn translate(&self, text: &str, target_language: &str) -> AppResult<String> {
        let language_name = match target_language {
            "fr" => "French",
            "es" => "Spanish",
            "de" => "German",
            "sw" => "Swahili",
            _ => target_language,
        };

        let prompt = format!(
            "Translate the following cultural craft story into {language_name}. \
            Preserve the warmth, cultural nuance, and storytelling tone. \
            Return only the translation, no preamble.\n\n{text}"
        );

        self.chat(&prompt).await
    }

    async fn chat(&self, prompt: &str) -> AppResult<String> {
        let request = ChatRequest {
            model: self.model.clone(),
            messages: vec![ChatMessage {
                role: "user".to_string(),
                content: prompt.to_string(),
            }],
            temperature: 0.7,
            max_tokens: 1024,
        };

        let response = self
            .client
            .post(GROQ_API_URL)
            .bearer_auth(&self.api_key)
            .json(&request)
            .send()
            .await
            .map_err(|e| AppError::Ai(format!("request failed: {e}")))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(AppError::Ai(format!("Groq API error {status}: {body}")));
        }

        let chat: ChatResponse = response
            .json()
            .await
            .map_err(|e| AppError::Ai(format!("invalid response: {e}")))?;

        chat.choices
            .into_iter()
            .next()
            .map(|c| c.message.content.trim().to_string())
            .filter(|s| !s.is_empty())
            .ok_or_else(|| AppError::Ai("empty response from Groq".into()))
    }
}
