<?php
/**
 * Plugin Name: MX-US Translator
 * Description: Custom English/Spanish translator with Mexico and USA flags.
 * Version: 1.0
 * Author: Antigravity
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class MX_US_Translator
{

    /**
     * Constructor.
     * Hooks into WordPress scripts and footer actions.
     */
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_footer', array($this, 'add_translation_markup'));
    }

    /**
     * Enqueue necessary styles and scripts.
     * Loads the plugin CSS, JS, and the external Google Translate API.
     */
    public function enqueue_scripts()
    {
        wp_enqueue_style('mx-us-style', plugin_dir_url(__FILE__) . 'style.css', array(), '1.0');
        wp_enqueue_script('mx-us-script', plugin_dir_url(__FILE__) . 'script.js', array('jquery'), '1.0', true);

        // Google Translate Script
        // We use the 'cb' parameter to call 'googleTranslateElementInit' when loaded.
        wp_enqueue_script('google-translate', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit', array(), null, true);
    }

    /**
     * Output the HTML markup for the custom toggle.
     * This is injected into the wp_footer.
     */
    public function add_translation_markup()
    {
        ?>
        <div id="google_translate_element" style="display:none;"></div>

        <div id="mx-us-toggle-container">
            <div class="mx-us-toggle-wrapper">
                <div class="mx-us-option" data-lang="es" title="Español (México)">
                    <span class="flag-icon flag-mx"></span>
                    <span class="lang-label">ES</span>
                </div>
                <div class="mx-us-divider">|</div>
                <div class="mx-us-option" data-lang="en" title="English (USA)">
                    <span class="flag-icon flag-us"></span>
                    <span class="lang-label">EN</span>
                </div>
            </div>
        </div>
        <?php
    }
}

new MX_US_Translator();
