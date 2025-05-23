use axum::{
    http::{HeaderName, HeaderValue, Method, Request, StatusCode},
    response::IntoResponse,
    Router,
};
use rust::db::init::{init_db, AppState};
use rust::tools::logging::init_logging;
use rust::tools::middleware::api_key::validate_api_key;
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer},
    timeout::TimeoutLayer,
    trace::TraceLayer,
};
use tracing::{error, info_span};

const REQUEST_ID_HEADER: &str = "x-request-id";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_logging().await;
    let state = AppState {
        db: init_db().await?,
    };

  let app_env = std::env::var("APP_ENV").unwrap_or_else(|_| "development".to_string());
let is_prod = app_env == "production";

let allowed_origin = if is_prod {
    std::env::var("ORIGIN").unwrap_or_else(|_| "localhost".to_string())
} else {
    "*".to_string() 
};

    // TODO implement rate limiting
    // TODO implement request signing
    // TODO IDEMPODENCY

    let protected_routes = Router::new()
        .nest("/browse", rust::api::routes::browse_routes::browse_routes())
        .nest(
            "/collect",
            rust::api::routes::collect_routes::collect_routes(),
        )
        .nest(
            "/formulate",
            rust::api::routes::formulate_routes::formulate_routes(),
        )
        .nest(
            "/suggestion",
            rust::api::routes::suggestion_routes::suggestion_routes(),
        )
        .nest("/auth", rust::api::routes::auth_routes::auth_routes())
        .layer(axum::middleware::from_fn(validate_api_key));

    let app = Router::new()
        .merge(protected_routes) // Everything else with API key protection
        .fallback(handler_404)
        .with_state(state)
        .layer(
            ServiceBuilder::new()
                .layer(SetRequestIdLayer::new(
                    HeaderName::from_static(REQUEST_ID_HEADER).clone(),
                    MakeRequestUuid,
                ))
                .layer(
                    TraceLayer::new_for_http().make_span_with(|request: &Request<_>| {
                        let request_id = request.headers().get(REQUEST_ID_HEADER);
                        match request_id {
                            Some(request_id) => info_span!(
                                "http_request",
                                request_id = ?request_id
                            ),
                            None => {
                                error!("could not extract request_id");
                                info_span!("http_request")
                            }
                        }
                    }),
                )
                .layer(PropagateRequestIdLayer::new(HeaderName::from_static(
                    REQUEST_ID_HEADER,
                )))
                .layer(TimeoutLayer::new(std::time::Duration::from_secs(10)))
                .layer(
                    CorsLayer::new()
                        .allow_origin(allowed_origin.parse::<HeaderValue>().unwrap())
                        .allow_methods([
                            Method::GET,
                            Method::POST,
                            Method::DELETE,
                            Method::PUT,
                            Method::PATCH,
                        ]),
                ),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;

    axum::serve(listener, app).await?;

    Ok(())
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Nothing to see here")
}


