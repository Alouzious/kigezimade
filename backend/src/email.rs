use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use std::sync::OnceLock;

static EMAIL_SERVICE: OnceLock<EmailService> = OnceLock::new();

pub fn email_service() -> &'static EmailService {
    EMAIL_SERVICE.get_or_init(EmailService::from_env)
}

pub struct EmailService {
    mailer: Option<SmtpTransport>,
    from: String,
    enabled: bool,
}

impl EmailService {
    pub fn from_env() -> Self {
        let host = std::env::var("SMTP_HOST").ok();
        let user = std::env::var("SMTP_USER").ok();
        let pass = std::env::var("SMTP_PASS").ok();
        let from = std::env::var("SMTP_FROM").unwrap_or_else(|_| "noreply@kigezimade.ug".into());

        let enabled = host.is_some() && user.is_some() && pass.is_some();

        let mailer = if let (Some(host), Some(user), Some(pass)) = (host, user, pass) {
            let port: u16 = std::env::var("SMTP_PORT")
                .unwrap_or_else(|_| "587".into())
                .parse()
                .unwrap_or(587);

            let creds = Credentials::new(user.clone(), pass);
            let transport = SmtpTransport::relay(&host)
                .ok()
                .map(|b| b.port(port).credentials(creds).build());

            if transport.is_none() {
                tracing::warn!("SMTP configured but relay failed for host {host}");
            }
            transport
        } else {
            tracing::info!("SMTP not configured — order emails will be skipped");
            None
        };

        Self {
            mailer,
            from,
            enabled,
        }
    }

    pub fn is_enabled(&self) -> bool {
        self.enabled && self.mailer.is_some()
    }

    pub fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), String> {
        let Some(mailer) = &self.mailer else {
            return Ok(());
        };

        let email = Message::builder()
            .from(
                self.from
                    .parse()
                    .map_err(|e| format!("invalid from address: {e}"))?,
            )
            .to(to
                .parse()
                .map_err(|e| format!("invalid to address: {e}"))?)
            .subject(subject)
            .header(ContentType::TEXT_PLAIN)
            .body(body.to_string())
            .map_err(|e| format!("build email: {e}"))?;

        mailer
            .send(&email)
            .map(|_| ())
            .map_err(|e| format!("send email: {e}"))
    }
}

pub fn send_order_notification(
    email: &EmailService,
    artisan_email: &str,
    artisan_name: &str,
    product_name: &str,
    buyer_name: &str,
    buyer_email: &str,
    buyer_phone: &str,
    quantity: i32,
    total_price: &str,
    message: &str,
) {
    if !email.is_enabled() {
        tracing::info!(
            "Order placed for {product_name} — email skipped (SMTP not configured)"
        );
        return;
    }

    let body = format!(
        "Hello {artisan_name},\n\n\
        You have a new order on Kigezi Made!\n\n\
        Product: {product_name}\n\
        Quantity: {quantity}\n\
        Total: {total_price} UGX\n\n\
        Buyer details:\n\
        Name: {buyer_name}\n\
        Email: {buyer_email}\n\
        Phone/WhatsApp: {buyer_phone}\n\
        {message_line}\n\
        Log in to your dashboard to view and manage this order.\n\n\
        — Kigezi Made",
        message_line = if message.is_empty() {
            String::new()
        } else {
            format!("Message: {message}\n")
        }
    );

    if let Err(e) = email.send(
        artisan_email,
        &format!("New order: {product_name}"),
        &body,
    ) {
        tracing::error!("failed to send artisan order email: {e}");
    }
}

pub fn send_buyer_confirmation(
    email: &EmailService,
    buyer_email: &str,
    buyer_name: &str,
    product_name: &str,
    artisan_name: &str,
    total_price: &str,
) {
    if !email.is_enabled() {
        return;
    }

    let body = format!(
        "Hello {buyer_name},\n\n\
        Thank you for your order on Kigezi Made!\n\n\
        Product: {product_name}\n\
        Artisan: {artisan_name}\n\
        Total: {total_price} UGX\n\n\
        The artisan will contact you soon via email or WhatsApp to arrange payment and delivery.\n\n\
        — Kigezi Made"
    );

    if let Err(e) = email.send(
        buyer_email,
        &format!("Order received: {product_name}"),
        &body,
    ) {
        tracing::error!("failed to send buyer confirmation email: {e}");
    }
}
