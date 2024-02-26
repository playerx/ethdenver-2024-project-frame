FROM denoland/deno:1.40.2

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY src/deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY src .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache app.ts

COPY ../public .

CMD ["run", "-A", "--unstable-broadcast-channel", "app.ts"]