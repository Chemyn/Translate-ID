/**
 * Google Translate Initialization.
 * Configures the Google Translate element to use 'en' and 'es' languages.
 * Layout is set to SIMPLE (inline), and autoDisplay is false to hide the popup.
 */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'auto',
        includedLanguages: 'en,es',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

(function ($) {
    $(document).ready(function () {

        // Helper to get cookie
        function getCookie(name) {
            var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        }

        // Helper to set cookie
        function setCookie(name, value, days) {
            var d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            document.cookie = name + "=" + value + ";path=/;domain=" + window.location.hostname;
        }

        // Determine current language from cookie
        // Cookie format usually: /auto/en or /en/es. We focus on the target language.
        var currentCookie = getCookie('googtrans');
        var currentLang = 'es'; // Default assumption or fallback

        if (currentCookie) {
            // Check if it ends with /en or /es
            if (currentCookie.match(/\/en$/)) {
                currentLang = 'en';
            } else if (currentCookie.match(/\/es$/)) {
                currentLang = 'es';
            }
        }

        // Set active class on load
        $('.mx-us-option[data-lang="' + currentLang + '"]').addClass('active');

        // Handle Click
        $('.mx-us-option').on('click', function () {
            var selectedLang = $(this).data('lang');

            // If already active, do nothing
            if ($(this).hasClass('active')) {
                return;
            }

            // Construct new cookie value: /auto/selectedLang
            // This tells Google Translate to translate from Auto to Selected
            var newCookieValue = '/auto/' + selectedLang;

            // Set cookie for top level domain
            setCookie('googtrans', newCookieValue, 30); // 30 days
            setCookie('googtrans', newCookieValue, 30); // secure/host variants sometimes needed, but standard path=/ usually works for simple sites.

            // Reload page to apply
            window.location.reload();
        });
    });
})(jQuery);
