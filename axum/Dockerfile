FROM rust:1.84-slim-bookworm AS builder
WORKDIR /usr/src/app
COPY Cargo.* ./
COPY .sqlx/ ./.sqlx
RUN mkdir src && \
    echo "fn main(){}" > src/main.rs && \
    cargo fetch
COPY src src/
RUN cargo build --release --locked && \
    strip target/release/rust

FROM debian:bookworm-slim
WORKDIR /app
RUN groupadd -r appuser && useradd -r -g appuser appuser
COPY --from=builder /usr/src/app/target/release/rust ./app
USER appuser
CMD ["./app"]