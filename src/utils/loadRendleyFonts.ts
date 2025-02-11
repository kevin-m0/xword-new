export function loadFonts(engine: any) {
  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Poetsen One",
      "https://fonts.googleapis.com/css2?family=Poetsen+One&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "The Alex Hormozi",
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Rubik",
      "https://fonts.googleapis.com/css2?family=Rubik:wght@800&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Unbounded",
      "https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Quicksand",
      "https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Lexend",
      "https://fonts.googleapis.com/css2?family=Lexend:wght@800&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Fira Sans Condensed",
      "https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:wght@800&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Playfair Display",
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Honk",
      "https://fonts.googleapis.com/css2?family=Honk&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Poppins",
      "https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap",
    );

  engine
    .getFontRegistry()
    .loadFromCssUrl(
      "Roboto",
      "https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap",
    );
}

export const fontFamilyOptions = [
  "Roboto",
  "Poppins",
  "Honk",
  "Playfair Display",
  "Fira Sans Condensed",
  "Lexend",
  "Unbounded",
  "Quicksand",
  "Rubik",
  "The Alex Hormozi",
  "Poetsen One",
];

// export const fontSizeOptions = [40, 64, 96];
export const fontSizeOptions = ["Small", "Medium", "Large"];

export const colorOptions = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];
