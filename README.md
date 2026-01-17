# Translate-ID (MX-US Translator)

This WordPress plugin provides a custom translation toggle that specifically targets **Spanish (Mexico)** and **English (USA)**. 

It leverages the Google Translate engine for the translation capability but replaces the default user interface with a sleek, floating toggle featuring the flags of Mexico and the USA.

## Features

*   **Custom Toggle Switch**: A fixed-position, floating widget in the bottom-right corner.
*   **Specific Localization**: 
    *   🇲🇽 **ES**: Uses the Mexico flag for Spanish.
    *   🇺🇸 **EN**: Uses the USA flag for English.
*   **Seamless Integration**: Hides the default Google Translate top bar for a cleaner look.
*   **Performance**: Flags are embedded as SVG data URIs, reducing HTTP requests.
*   **Persistence**: Remembers the user's language choice using cookies.

## Installation

1.  Download the `mx-us-translator` folder.
2.  Upload it to your WordPress site's `wp-content/plugins/` directory.
3.  Activate the "MX-US Translator" plugin from the WordPress admin panel.
4.  The toggle will automatically appear in the footer of your website.

## Requirements

*   WordPress 5.0+
*   PHP 7.0+

## Code Structure

*   **mx-us-translator.php**: The main plugin entry point.
    *   `enqueue_scripts()`: Loads the CSS and JS assets and the Google Translate API.
    *   `add_translation_markup()`: Outputs the HTML for the custom flag toggle in the footer.
*   **script.js**: Handles the client-side logic.
    *   Initializes the Google Translate Instance.
    *   Manages the `googtrans` cookie to persist the user's language preference (English/Spanish).
    *   Reloads the page upon selection to apply the translation.
*   **style.css**: manages the visual presentation.
    *   Contains the CSS to Style the floating toggle.
    *   Includes base64 embedded SVGs for the Mexico and USA flags to avoid external image dependencies.
    *   Hides the default Google Translate toolbar (`.goog-te-banner-frame`).
