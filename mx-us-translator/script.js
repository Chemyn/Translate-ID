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

        // Inject Toggle and Loading Mask HTML dynamically
        function injectElements() {
            if ($('#mx-us-toggle-container').length) return;

            // Loading Mask
            var maskHTML = `
                <div id="mx-us-loading-mask" class="mx-us-loading-mask">
                    <div class="mx-us-loading-spinner"></div>
                    <span id="mx-us-loading-text">Traduciendo...</span>
                </div>
            `;

            // Toggle
            var toggleHTML = `
                <div id="mx-us-toggle-container">
                    <div class="mx-us-toggle-wrapper notranslate">
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
            `;
            $('body').append(maskHTML + toggleHTML);
        }

        // Show loading mask with specific text
        function showLoadingMask(targetLang) {
            var text = targetLang === 'es' ? 'Traduciendo...' : 'Translating...';
            $('#mx-us-loading-text').text(text);
            $('#mx-us-loading-mask').addClass('active');
        }

        // Hide loading mask
        function hideLoadingMask() {
            $('#mx-us-loading-mask').removeClass('active');
        }

        // Determine initial language based on geolocation
        function detectLocationAndSetLang() {
            var currentCookie = getCookie('googtrans');

            // If cookie exists, we already have a preference
            if (currentCookie) {
                applyLangFromCookie(currentCookie);
                // If it's not the default (English usually), show mask while it loads
                if (!currentCookie.match(/\/en$/)) {
                    showLoadingMask('es');
                }
                return;
            }

            // Otherwise, check geolocation
            $.getJSON('https://ipapi.co/json/', function (data) {
                var detectedLang = 'en'; // Default
                if (data.country_code === 'MX') {
                    detectedLang = 'es';
                }

                if (detectedLang === 'es') {
                    showLoadingMask('es');
                    var newCookieValue = '/auto/es';
                    setCookie('googtrans', newCookieValue, 30);
                    window.location.reload();
                } else {
                    $('.mx-us-option[data-lang="en"]').addClass('active');
                }
            }).fail(function () {
                $('.mx-us-option[data-lang="en"]').addClass('active');
            });
        }

        function applyLangFromCookie(cookie) {
            var currentLang = 'en';
            if (cookie.match(/\/es$/)) {
                currentLang = 'es';
            }
            $('.mx-us-option[data-lang="' + currentLang + '"]').addClass('active');
        }

        // Initialize
        injectElements();
        detectLocationAndSetLang();

        // Handle Click
        $(document).on('click', '.mx-us-option', function () {
            var selectedLang = $(this).data('lang');
            if ($(this).hasClass('active')) return;

            showLoadingMask(selectedLang);
            var newCookieValue = '/auto/' + selectedLang;
            setCookie('googtrans', newCookieValue, 30);
            window.location.reload();
        });

        // Force hide Google Translate top bar & control loading mask
        $('body').css('top', '0px');

        var checkBanner = setInterval(function () {
            var iframe = $('.goog-te-banner-frame');
            if (!iframe.length) {
                iframe = $('iframe[id*=".container"]');
            }

            if (iframe.length) {
                iframe.hide();
                iframe.css('visibility', 'hidden');
                iframe.css('height', '0');
                $('body').css('top', '0px');
                $('body').css('position', 'static');

                // Once Google is hidden, we can hide our mask
                hideLoadingMask();
            }

            // Fallback for safety: if translation finished class is present on html/body
            if ($('html').hasClass('translated-ltr') || $('html').hasClass('translated-rtl')) {
                // If the iframe hasn't appeared yet but translation happened, hide mask soon
                setTimeout(hideLoadingMask, 500);
            }

            $('.skiptranslate').each(function () {
                if ($(this).text().indexOf('Translate') > -1) {
                    if ($(this).parent().is('body')) {
                        $(this).hide();
                        hideLoadingMask();
                    }
                }
            });
        }, 500);

    });
})(jQuery);
