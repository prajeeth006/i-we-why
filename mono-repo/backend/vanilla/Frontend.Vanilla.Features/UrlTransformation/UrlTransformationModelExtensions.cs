using Frontend.Vanilla.Core.System.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal static class UrlTransformationModelExtensions
    {
        private const string EsportLobby = "esports";
        private const string SportsArea = "Sports";

        private static readonly IEnumerable<PropertyInfo> TranslationProperties = typeof(UrlTranslation).GetProperties();

        private static readonly IDictionary<string, PropertyInfo> LocaleProperties = typeof(IUrlTransformationConfiguration)
            .GetProperties()
            .SelectMany(prop => prop.GetCustomAttributes<LocaleAttribute>().Select(localeAttr => (Property: prop, Attribute: localeAttr)))
            .ToDictionary(prop => prop.Attribute.Locale?.ToLowerInvariant() ?? prop.Property.Name.ToLowerInvariant(), prop => prop.Property);

        public static Dictionary<string, string> ToDictionary(this UrlTranslation model)
        {
            return TranslationProperties.ToDictionary(prop => prop.Name.ToCamelCase(), prop => (string)prop.GetValue(model)!);
        }

        public static Dictionary<string, UrlTranslation> ToDictionary(this IUrlTransformationConfiguration config)
        {
            return LocaleProperties.ToDictionary(prop => prop.Key, prop => (UrlTranslation)prop.Value.GetValue(config)!);
        }

        public static bool IsSportRequest(this Uri uri)
        {
            var (area, target) = ParseUri(uri);
            return (Equals(area, SportsArea) || Equals(area, EsportLobby)) && !Equals(target, "api") && !Equals(target, "bet-station");
        }

        private static bool Equals(string first, string second) => string.Equals(first, second, StringComparison.OrdinalIgnoreCase);

        private static (string area, string target) ParseUri(Uri uri)
        {
            var path = uri.IsAbsoluteUri ? uri.LocalPath : uri.OriginalString.Split('?').FirstOrDefault() ?? string.Empty;
            var segments = path.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

            var area = segments.Length > 1 ? segments[1] : string.Empty;
            var target = segments.Length > 2 ? segments[2] : string.Empty;

            return (area, target);
        }
    }
}
