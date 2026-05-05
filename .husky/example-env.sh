ENV_FILE=".env"
ENV_EXAMPLE_FILE=".env.example"

if [ -f "$ENV_FILE" ]; then
  # Generate env.example file
  echo "Generating $ENV_EXAMPLE_FILE..."

  awk -F'=' '{print $1 ""}' "$ENV_FILE" > "$ENV_EXAMPLE_FILE"

  git add $ENV_EXAMPLE_FILE

  echo "$ENV_EXAMPLE_FILE has been generated."
else
  echo "$ENV_FILE not found. Skipping $ENV_EXAMPLE_FILE generation."
fi

