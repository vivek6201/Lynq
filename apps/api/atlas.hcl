data "external_schema" "gorm" {
  program = [
    "go",
    "run",
    "-mod=mod",
    "ariga.io/atlas-provider-gorm",
    "load",
    "--path", "./internal/models",
    "--dialect", "postgres"
  ]
}

env "local" {
  src = data.external_schema.gorm.url
  dev = "docker://postgres/15/dev?search_path=public"
  url = getenv("DB_URL")

  migration {
    dir = "file://migrations"
  }
}
