#!/usr/bin/env python3

from pathlib import Path


def create_html(errors_dir, title, code, message):
    html = f"""<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{message}</h1>
  </body>
</html>
"""
    with open(errors_dir / f"{code}.html", "w", encoding="utf-8") as fp:
        fp.write(html)


def main():
    # for a list of error codes and messages see:
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    title = "Game Launcher - Aurora WebUI"
    errors = [
        (400, "Bad Request"),
        (401, "Unauthorized"),
        (403, "Forbidden"),
        (404, "Not Found"),
        (409, "Conflict"),
        (424, "Failed Dependency"),
        (429, "Too Many Requests"),
        (500, "Internal Server Error"),
        (501, "Not Implemented"),
    ]
    errors_dir = Path("src/errors")
    if not errors_dir.is_dir():
        raise ValueError(
            "The directory to store all of the error html files does not exist."
            f" Please create the directory: {errors_dir.absolute()}"
        )
    for code, message in errors:
        create_html(errors_dir, title, code, message)


if __name__ == "__main__":
    main()
