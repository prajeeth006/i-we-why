using System;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = true)]
    internal class LocaleAttribute : Attribute
    {
        public LocaleAttribute(string? locale = null)
        {
            Locale = locale;
        }

        public string? Locale { get; }
    }
}
