using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.NativeApp;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Timers;
using Timer = System.Timers.Timer;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal sealed class UrlTransformationLocalizationProvider : IUrlTransformationLocalizationProvider, IDisposable
    {
        private readonly ILanguageService languageResolver;
        private readonly IUrlTransformationConfiguration urlsConfiguration;
        private readonly ILogger<UrlTransformationLocalizationProvider> logger;
        private readonly INativeAppService nativeAppService;

        private readonly Timer timer;
        private Dictionary<string, UrlTranslation>? mappings;
        private Dictionary<string, Dictionary<string, string>>? localizations;
        private Dictionary<string, List<UrlTransformation>>? urlMatchers;
        private Dictionary<string, List<string>>? seoMatchers;

        private Dictionary<string, UrlTranslation> Mappings => mappings ??= urlsConfiguration.ToDictionary();

        private Dictionary<string, Dictionary<string, string>> Localizations =>
            localizations ??= Mappings.ToDictionary(lang => lang.Key, MapLocalizations);

        private Dictionary<string, List<string>> SeoMatchers => seoMatchers ??= MapSeoMatchers();

        public string CurrentLocale => languageResolver.Current.RouteValue.Value.ToLowerInvariant();

        public string DefaultLocale => "en";

        private Dictionary<string, string> DefaultDictionary => Localizations[DefaultLocale];

        public UrlTransformationLocalizationProvider(
            IUrlTransformationConfiguration urlsConfiguration,
            ILanguageService languageResolver,
            ILogger<UrlTransformationLocalizationProvider> logger,
            INativeAppService nativeAppService)
        {
            this.languageResolver = languageResolver;
            this.urlsConfiguration = urlsConfiguration;
            this.logger = logger;
            this.nativeAppService = nativeAppService;

            timer = new Timer
            {
                Interval = 2 * 60 * 1000,
                Enabled = true,
                AutoReset = true,
            };

            timer.Elapsed += Tick;
        }

        public IDictionary<string, string> GetLocalizations(string? language = null)
        {
            if (Localizations.TryGetValue(language?.ToLowerInvariant() ?? DefaultLocale, out var model))
            {
                return model;
            }

            return DefaultDictionary;
        }

        public IEnumerable<string> GetSeoMatchers()
        {
            SeoMatchers.TryGetValue(CurrentLocale, out var defaultTransformations);

            return defaultTransformations?.AsEnumerable() ?? [];
        }

        public string Sanitize(string input)
        {
            return input.ToLowerInvariant()
                .PatternReplace(urlsConfiguration.UrlSanitizer, " ")
                .Trim()
                .PatternReplace("\\s+", "-")
                .Truncate(urlsConfiguration.MaxTokenLength);
        }

        public void Dispose()
        {
            if (timer != null)
            {
                timer.Enabled = false;
                timer.Stop();
                timer.Dispose();
            }
        }

        public string GetTranslated(string key)
        {
            return GetLocalizations(CurrentLocale).GetValue(key) ?? key;
        }

        private Dictionary<string, string> MapLocalizations(KeyValuePair<string, UrlTranslation> lang)
        {
            var currentApp = nativeAppService.GetCurrentDetails();
            var values = lang.Value.ToDictionary();
            values = currentApp.IsTerminal ? values.ToDictionary(x => x.Key, x => x.Key) : values.ToDictionary(x => x.Key, x =>
            {
                if (x.Value.IsNullOrEmpty())
                {
                    logger.LogError($"[UrlTransformation] - UrlTranslation created for for {x.Key} but missing in Dynacon configuration for language {lang.Key}. Returning empty value.");
                    return string.Empty;
                }
                else
                {
                    return Sanitize(x.Value);
                }
            });

            var duplicates = values.GroupBy(x => x.Value, StringComparer.OrdinalIgnoreCase).Where(x => x.Count() > 1);

            if (duplicates.Any())
            {
                foreach (var duplicate in duplicates)
                {
                    logger.LogError($"[UrlTransformation] - Found duplicate translation for {lang.Key} for the keys {string.Join(", ", duplicate.Select(x => x.Key))} automatically suffixing duplicates");

                    foreach (var (key, index) in duplicate.Select((x, index) => (x.Key, ++index)))
                    {
                        values[key] += $"-{index}";
                    }
                }
            }

            return values;
        }

        private string GetTranslated(string token, IDictionary<string, string> mapping)
        {
            foreach (var pair in mapping)
            {
                token = token.Replace($"{{{pair.Key}}}", pair.Value);
            }

            return token;
        }

        private Dictionary<string, List<string>> MapSeoMatchers()
        {
            return Mappings.Keys.ToDictionary(
                x => x,
                x =>
                {
                    var mappings = GetLocalizations(x);

                    return urlsConfiguration.SeoUrlMatchers.Select(y => GetTranslated(y, mappings)).ToList();
                });
        }

        private void Tick(object? sender, ElapsedEventArgs e)
        {
            try
            {
                Interlocked.Exchange(ref mappings, null);
                Interlocked.Exchange(ref localizations, null);
                Interlocked.Exchange(ref urlMatchers, null);
                Interlocked.Exchange(ref seoMatchers, null);
            }
            catch (Exception ex)
            {
                logger.LogError("[UrlTransformation] - Failed to renew translations. {0}", ex);
            }
        }
    }
}
