/**
 * Google Translate Initialization.
 * Configures the Google Translate element to use 'es' as the source language.
 * Included languages are 'en' and 'es'.
 */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'es', // Original language is Spanish
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

        /**
         * Robust Helper to delete cookie across multiple potential domains.
         * This prevents 'googtrans' conflicts between www and root domains.
         */
        function deleteCookie(name) {
            var hostname = window.location.hostname;
            var domainParts = hostname.split('.');
            var paths = ['/', '/wp-content/plugins/mx-us-translator/']; // Common paths

            // Attempt to clear from current host and all parent domains
            while (domainParts.length > 0) {
                var domain = domainParts.join('.');
                paths.forEach(function (path) {
                    document.cookie = name + "=;path=" + path + ";domain=" + domain + ";expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    document.cookie = name + "=;path=" + path + ";domain=." + domain + ";expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                });
                domainParts.shift();
            }
            // Final fallback for current path/host
            document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        }

        // Helper to set cookie
        function setCookie(name, value, days) {
            // Always clean up siblings first to avoid conflicts
            deleteCookie(name);

            var d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            var expires = ";expires=" + d.toUTCString();

            // Set for root domain if possible (stripping www)
            var domain = window.location.hostname.replace(/^www\./, '');
            document.cookie = name + "=" + value + expires + ";path=/;domain=." + domain;
            document.cookie = name + "=" + value + expires + ";path=/;domain=" + domain;
        }

        // Prevent translation of specific branding
        function addNoTranslateAttributes() {
            $('.text-2xl.font-display.font-bold.tracking-tighter').each(function () {
                if ($(this).text().indexOf('IMPERIO') !== -1) {
                    $(this).addClass('notranslate');
                }
            });
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
                // If it's translating to English, show mask
                if (currentCookie.match(/\/en$/)) {
                    showLoadingMask('en');
                    setTimeout(hideLoadingMask, 1500);
                }
                return;
            }

            // Otherwise, check geolocation
            $.getJSON('https://ipapi.co/json/', function (data) {
                if (data.country_code === 'US') {
                    // Users from US get English
                    showLoadingMask('en');
                    setCookie('googtrans', '/es/en', 30);
                    window.location.reload();
                } else {
                    // Everyone else (including MX) stays in native Spanish
                    $('.mx-us-option[data-lang="es"]').addClass('active');
                }
            }).fail(function () {
                // Default to Spanish (native)
                $('.mx-us-option[data-lang="es"]').addClass('active');
            });
        }

        function applyLangFromCookie(cookie) {
            var currentLang = 'es'; // Default is Spanish
            if (cookie.match(/\/en$/)) {
                currentLang = 'en';
            }
            $('.mx-us-option[data-lang="' + currentLang + '"]').addClass('active');
        }

        // Initialize
        addNoTranslateAttributes();
        injectElements();
        detectLocationAndSetLang();

        // Handle Click
        $(document).on('click', '.mx-us-option', function () {
            var selectedLang = $(this).data('lang');
            if ($(this).hasClass('active')) return;

            showLoadingMask(selectedLang);

            if (selectedLang === 'es') {
                // Revert to native Spanish by clearing cookie robustly
                deleteCookie('googtrans');
            } else {
                // Translate to English explicitly from Spanish
                setCookie('googtrans', '/es/en', 30);
            }

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

                // Once Google is hidden, wait a bit to ensure text repaints, then hide mask
                setTimeout(hideLoadingMask, 1500);
            }

            // Fallback for safety: if translation finished class is present on html/body
            if ($('html').hasClass('translated-ltr') || $('html').hasClass('translated-rtl')) {
                setTimeout(hideLoadingMask, 1500);
            }

            $('.skiptranslate').each(function () {
                if ($(this).text().indexOf('Translate') > -1) {
                    if ($(this).parent().is('body')) {
                        $(this).hide();
                        setTimeout(hideLoadingMask, 1500);
                    }
                }
            });
        }, 500);

        // Final safety net
        setTimeout(hideLoadingMask, 5000);

    });
})(jQuery);
